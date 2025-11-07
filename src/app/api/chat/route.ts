// src/app/api/chat/route.ts
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { chatId, content } = await req.json()

    if (!chatId || !content) {
      return new Response('ChatId and content are required', { status: 400 })
    }

    // Проверяем существование чата
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', user.id)
      .single()

    if (chatError || !chat) {
      return new Response('Chat not found', { status: 404 })
    }

    // Сохраняем сообщение пользователя
    await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        role: 'user',
        content
      })

    // Получаем историю сообщений
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(20)

    // Обновляем время последнего обновления чата
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatId)

    // Форматируем сообщения для Gemini API
    const geminiMessages = messages?.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) || []

    // Вызываем Gemini API со streaming
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini API error:', error)
      return new Response('Failed to get response from AI', { status: 500 })
    }

    // Создаем поток для стриминга ответа клиенту
    const encoder = new TextEncoder()
    let fullText = ''

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        
        if (!reader) {
          controller.close()
          return
        }

        try {
          let buffer = ''
          
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              // Сохраняем полный ответ в БД
              if (fullText) {
                await supabase
                  .from('messages')
                  .insert({
                    chat_id: chatId,
                    role: 'assistant',
                    content: fullText
                  })
              }
              controller.close()
              break
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            
            // Оставляем последнюю неполную строку в буфере
            buffer = lines.pop() || ''
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6).trim()
                
                if (!jsonStr || jsonStr === '[DONE]') continue
                
                try {
                  const data = JSON.parse(jsonStr)
                  
                  // Извлекаем текст из ответа Gemini
                  const candidates = data.candidates || []
                  
                  for (const candidate of candidates) {
                    const content = candidate.content
                    if (!content) continue
                    
                    const parts = content.parts || []
                    for (const part of parts) {
                      if (part.text) {
                        fullText += part.text
                        // Отправляем чанк клиенту
                        controller.enqueue(encoder.encode(part.text))
                      }
                    }
                  }
                } catch (parseError) {
                  console.error('Parse error:', parseError, 'Line:', jsonStr)
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}