// src/types/chat.ts

export interface Message {
  id: string
  chat_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  images?: ImageAttachment[]
  created_at: string
}

export interface ImageAttachment {
  id: string
  url: string
  mimeType: string
  name: string
  size: number
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
  images?: ImageAttachment[]
}

export interface GeminiPart {
  text?: string
  inlineData?: {
    mimeType: string
    data: string // base64
  }
}

export interface GeminiMessage {
  role: 'user' | 'model'
  parts: GeminiPart[]
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