// src/app/api/chat/route.ts
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent'

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

    // Вызываем Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}&alt=sse`, {
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

    // Создаем поток для стриминга ответа
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    let fullText = ''

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
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

            // Парсим SSE события
            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonStr = line.slice(6)
                  if (jsonStr.trim() === '[DONE]') continue
                  
                  const data = JSON.parse(jsonStr)
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
                  
                  if (text) {
                    fullText += text
                    controller.enqueue(encoder.encode(text))
                  }
                } catch (e) {
                  // Игнорируем ошибки парсинга
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
        'Transfer-Encoding': 'chunked',
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