// src/types/chat.ts

export interface Message {
  id: string
  chat_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface Chat {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  messages?: Message[]
}

export interface CreateChatRequest {
  title?: string
}

export interface SendMessageRequest {
  chatId: string
  content: string
}

export interface GeminiMessage {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

export interface GeminiRequest {
  contents: GeminiMessage[]
  generationConfig?: {
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
  }
}