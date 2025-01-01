'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, MoreVertical, Check } from 'lucide-react'
import { AnimatedAvatar } from './animated-avatar'
import { colors } from '@/styles/colors'
import { Person } from '@/store/useContact'
import { getChatForContact } from '@/data/chats'
import { format } from 'date-fns'
import { Message } from '@/data/chats'

interface ChatSectionProps {
  selectedContact?: Person;
}

export function ChatSection({ selectedContact }: ChatSectionProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedContact) {
      const chat = getChatForContact(selectedContact.id)
      setMessages(chat?.messages || [])
    }
  }, [selectedContact])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!message.trim() || !selectedContact) return
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      content: message,
      senderId: 'user123',
      timestamp: new Date().toISOString(),
      status: 'sent'
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-900">
        <p className="text-zinc-500 text-center">Select a contact to start chatting</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-screen" style={{ backgroundColor: colors.background }}>
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-2 border-l border-zinc-800" 
           style={{ backgroundColor: colors.surface }}>
        <div className="flex items-center">
          <AnimatedAvatar
            src={selectedContact.avatar}
            alt={selectedContact.name}
            fallback={selectedContact.name.charAt(0)}
          />
          <div className="ml-3">
            <h2 className="text-zinc-100 text-[15px] font-medium">{selectedContact.name}</h2>
            <p className="text-xs text-zinc-500">online</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:bg-zinc-800/50 rounded-full transition-colors group relative"
        >
          <MoreVertical className="h-5 w-5" />
          <span className="absolute -bottom-8 right-0 px-2 py-1 bg-zinc-800 text-xs text-zinc-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Menu
          </span>
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 'user123' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[65%] rounded-lg px-3 py-2 ${
                msg.senderId === 'user123'
                  ? 'bg-[#005c4b] ml-auto'
                  : 'bg-[#202c33]'
              }`}
            >
              <p className="text-zinc-100 text-sm">{msg.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-zinc-400">
                  {format(new Date(msg.timestamp), 'HH:mm')}
                </span>
                {msg.senderId === 'user123' && (
                  <Check className="h-3 w-3 text-zinc-400" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-4 py-3" style={{ backgroundColor: colors.surface }}>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow text-zinc-200 rounded-lg border-0 focus-visible:ring-0"
            style={{ backgroundColor: colors.inputBackground }}
          />
          <Button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="rounded-full p-2 transition-colors"
            style={{ 
              backgroundColor: colors.accent,
              opacity: message.trim() ? 1 : 0.7 
            }}
          >
            <Send className="h-5 w-5 text-zinc-900" />
          </Button>
        </div>
      </div>
    </div>
  )
}

