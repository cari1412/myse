// src/components/AIChat.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, Bot, User as UserIcon, Sparkles, Plus, Trash2, MessageSquare, Camera, Image as ImageIcon, X } from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface ImageAttachment {
  id: string
  url: string
  data: string
  mimeType: string
  name: string
  size: number
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: ImageAttachment[]
}

interface Chat {
  id: string
  title: string
  updated_at: string
}

interface AIChatProps {
  user: User
}

export default function AIChat({ user }: AIChatProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingChats, setIsLoadingChats] = useState(true)
  const [attachedImages, setAttachedImages] = useState<ImageAttachment[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Загрузка чатов при монтировании
  useEffect(() => {
    loadChats()
  }, [])

  // Загрузка сообщений при смене чата
  useEffect(() => {
    if (currentChatId) {
      loadMessages(currentChatId)
    }
  }, [currentChatId])

  const loadChats = async () => {
    try {
      const response = await fetch('/api/chats')
      const data = await response.json()
      
      if (data.chats) {
        setChats(data.chats)
        if (data.chats.length > 0 && !currentChatId) {
          setCurrentChatId(data.chats[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading chats:', error)
    } finally {
      setIsLoadingChats(false)
    }
  }

  const loadMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      const data = await response.json()
      
      if (data.chat?.messages) {
        setMessages(data.chat.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          images: msg.images || []
        })))
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' })
      })
      
      const data = await response.json()
      
      if (data.chat) {
        setChats([data.chat, ...chats])
        setCurrentChatId(data.chat.id)
        setMessages([])
        setAttachedImages([])
      }
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this chat?')) return
    
    try {
      await fetch(`/api/chats/${chatId}`, { method: 'DELETE' })
      
      const newChats = chats.filter(c => c.id !== chatId)
      setChats(newChats)
      
      if (currentChatId === chatId) {
        setCurrentChatId(newChats[0]?.id || null)
        setMessages([])
        setAttachedImages([])
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: ImageAttachment[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image`)
        continue
      }

      // Проверка размера (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB`)
        continue
      }

      try {
        const base64 = await fileToBase64(file)
        
        newImages.push({
          id: `img-${Date.now()}-${i}`,
          url: URL.createObjectURL(file),
          data: base64,
          mimeType: file.type,
          name: file.name,
          size: file.size
        })
      } catch (error) {
        console.error('Error processing file:', error)
        alert(`Error processing ${file.name}`)
      }
    }

    setAttachedImages(prev => [...prev, ...newImages])
    
    // Сброс input
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Убираем префикс data:image/xxx;base64,
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  const removeImage = (imageId: string) => {
    setAttachedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId)
      // Освобождаем URL объект
      const img = prev.find(i => i.id === imageId)
      if (img?.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url)
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if ((!input.trim() && attachedImages.length === 0) || isLoading || !currentChatId) return
    
    const userMessage = input.trim()
    const imagesToSend = [...attachedImages]
    
    setInput('')
    setAttachedImages([])
    setIsLoading(true)

    // Добавляем сообщение пользователя сразу в UI
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      images: imagesToSend
    }
    setMessages(prev => [...prev, tempUserMsg])

    // Создаем временное сообщение ассистента для streaming
    const tempAssistantMsg: Message = {
      id: `temp-assistant-${Date.now()}`,
      role: 'assistant',
      content: ''
    }
    setMessages(prev => [...prev, tempAssistantMsg])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: currentChatId,
          content: userMessage || 'Analyze this image',
          images: imagesToSend
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Читаем streaming ответ
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break
          
          const chunk = decoder.decode(value)
          accumulatedText += chunk
          
          // Обновляем последнее сообщение (ассистента)
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = {
              ...tempAssistantMsg,
              content: accumulatedText
            }
            return newMessages
          })
        }
      }

      // После завершения перезагружаем чаты и сообщения
      await loadChats()
      await loadMessages(currentChatId)
      
    } catch (error) {
      console.error('Error sending message:', error)
      // Убираем временные сообщения при ошибке
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')))
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingChats) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar с чатами */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chats.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No chats yet</p>
              <p className="text-xs mt-1">Create one to start!</p>
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  currentChatId === chat.id
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(chat.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Область чата */}
      <div className="flex-1 flex flex-col">
        {!currentChatId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to AI Chat
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create a new chat to start conversation with vision AI
              </p>
              <button
                onClick={createNewChat}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                Start Chatting
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Start a conversation with AI
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    You can send text and images for analysis
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-purple-500 to-cyan-500'
                        : 'bg-gradient-to-br from-orange-500 to-pink-500'
                    }`}>
                      {message.role === 'user' ? (
                        <UserIcon className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      {/* Изображения */}
                      {message.images && message.images.length > 0 && (
                        <div className={`mb-2 flex flex-wrap gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {message.images.map(img => (
                            <div key={img.id} className="relative group">
                              <img 
                                src={img.url} 
                                alt={img.name}
                                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Текст сообщения */}
                      {message.content && (
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content || (isLoading && index === messages.length - 1 ? (
                              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                            ) : '')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Форма ввода */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                {/* Превью прикрепленных изображений */}
                {attachedImages.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachedImages.map(img => (
                      <div key={img.id} className="relative group">
                        <img 
                          src={img.url} 
                          alt={img.name}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  {/* Кнопка камеры */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isLoading}
                    className="px-3 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    title="Take photo"
                  >
                    <Camera className="w-5 h-5" />
                  </button>

                  {/* Кнопка галереи */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="px-3 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    title="Upload from gallery"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>

                  {/* Поле ввода */}
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message or attach images..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  />

                  {/* Кнопка отправки */}
                  <button
                    type="submit"
                    disabled={isLoading || (!input.trim() && attachedImages.length === 0)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}