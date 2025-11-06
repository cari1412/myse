// src/app/api/chat/route.ts (ИСПРАВЛЕННАЯ ВЕРСИЯ)

import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

// Попробуй разные модели если одна не работает:
const MODELS = [
  'google/gemini-2.0-flash-exp:free',           // Google Gemini (быстрая)
  'meta-llama/llama-3.2-3b-instruct:free',      // Meta Llama  
  'microsoft/phi-3-mini-128k-instruct:free',    // Microsoft Phi
  'deepseek/deepseek-r1-0528:free',             // DeepSeek (может быть недоступна)
]

const MODEL = MODELS[0] // Используем первую (Gemini)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Проверяем наличие API ключа
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body = await request.json()
    const { chatId, content } = body

    if (!chatId || !content) {
      return new Response(
        JSON.stringify({ error: 'ChatId and content are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Проверяем что чат принадлежит пользователю
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', user.id)
      .single()

    if (chatError || !chat) {
      return new Response(
        JSON.stringify({ error: 'Chat not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Сохраняем сообщение пользователя
    const { error: userMessageError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        role: 'user',
        content
      })

    if (userMessageError) {
      console.error('Error saving user message:', userMessageError)
      return new Response(
        JSON.stringify({ error: 'Failed to save message' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Получаем историю сообщений для контекста
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(20) // Ограничиваем контекст последними 20 сообщениями

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch messages' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Обновляем updated_at чата
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatId)

    // Формируем сообщения для OpenRouter
    const openRouterMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }))

    // Получаем URL сайта
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin') || 'https://myse.vercel.app'

    console.log('Making request to OpenRouter:', {
      model: MODEL,
      messagesCount: openRouterMessages.length,
      siteUrl
    })

    // Делаем запрос к OpenRouter с streaming
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': siteUrl,
        'X-Title': 'GradientSaaS AI Chat'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: openRouterMessages,
        stream: true,
        max_tokens: 2000, // Ограничение на длину ответа
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      
      // Специальная обработка 429 ошибки
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again in a few moments.',
            details: 'OpenRouter API rate limit reached'
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'AI service error',
          details: `Status: ${response.status}, ${errorText.substring(0, 200)}`
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Создаем ReadableStream для streaming ответа
    const encoder = new TextEncoder()
    let fullResponse = ''

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              // Сохраняем полный ответ ассистента в БД
              if (fullResponse) {
                await supabase
                  .from('messages')
                  .insert({
                    chat_id: chatId,
                    role: 'assistant',
                    content: fullResponse
                  })
                
                console.log('Assistant response saved, length:', fullResponse.length)
              }
              
              controller.close()
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n').filter(line => line.trim() !== '')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                
                if (data === '[DONE]') {
                  continue
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content
                  
                  if (content) {
                    fullResponse += content
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                  }
                } catch (e) {
                  // Игнорируем ошибки парсинга отдельных чанков
                  console.log('Parse error for chunk:', e)
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}