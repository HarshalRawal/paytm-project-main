'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, CreditCard, DollarSign, X } from 'lucide-react'

interface ChatSectionProps {
  personName: string;
  onClose: () => void;
}

export function ChatSection({ personName, onClose }: ChatSectionProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    console.log(`Sending message to ${personName}: ${message}`)
    setMessage('')
  }

  return (
    <motion.div 
      className="space-y-4 bg-zinc-900 rounded-xl p-4 border border-zinc-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-zinc-100">Chat with {personName}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="bg-zinc-800/50 rounded-lg h-40 overflow-y-auto p-4 border border-zinc-700">
        <p className="text-zinc-500 text-center text-sm">No messages yet</p>
      </div>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow bg-zinc-800/50 border-zinc-700 text-zinc-100 
                     placeholder-zinc-500 focus:border-zinc-600 focus:ring-2 
                     focus:ring-zinc-600/50 rounded-lg"
        />
        <Button 
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
      <div className="flex space-x-2">
        <Button 
          onClick={() => console.log('Pay')}
          variant="outline"
          className="flex-1 bg-zinc-800/50 border-emerald-600/50 text-emerald-400 
                     hover:bg-emerald-600/20 hover:border-emerald-500 rounded-lg"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Pay
        </Button>
        <Button 
          onClick={() => console.log('Request')}
          variant="outline"
          className="flex-1 bg-zinc-800/50 border-amber-600/50 text-amber-400 
                     hover:bg-amber-600/20 hover:border-amber-500 rounded-lg"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Request
        </Button>
      </div>
    </motion.div>
  )
}

