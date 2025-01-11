'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, MoreVertical, Check, CreditCard, DollarSign, X, Phone, AtSign } from 'lucide-react'
import { AnimatedAvatar } from './animated-avatar'
import { Person } from '@/store/useContact'
import { getChatForContact } from '@/data/chats'
import { format } from 'date-fns'
import { Message } from '@/data/chats'
import { motion, AnimatePresence } from 'framer-motion'
import { PaymentModal } from './payment-model'
import { useWebSocketStore } from '@/store/webSocketStore'
import { getUserId } from '@/lib/getUserId'


interface ChatSectionProps {
  selectedContact?: Person;
}

interface Transaction {
  amount: number;
  receiverName: string;
  timestamp: string;
}

export function ChatSection({ selectedContact }: ChatSectionProps) {
  const senderId = "3291280e-5400-490d-8865-49f6591c249c"

  // const userId = getUserId()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

 // const {sendMessage} = useWebSocket(senderId);
 const {connect,sendMessage,isConnected} = useWebSocketStore();
  useEffect(() => {
    if (selectedContact) {
      const chat = getChatForContact(selectedContact.id)
      setMessages(chat?.messages || [])
      connect(senderId);
    }
  }, [selectedContact,connect])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, transactions])

  const handleSend = () => {
    if (!message.trim() || !selectedContact)
       return
      if(!isConnected){
        connect(senderId);
      }
    // Send message using WebSocket connection
    // Assuming you have the socketService or equivalent in the `useWebSocket` hook
      sendMessage({
         event:"chat-messages",
         data:{
          senderId,
          receiverId: selectedContact.id,
          content: message,
          timestamp: new Date().toISOString(),
         }
      })
      // Add message to local state after sending
      const newMessage: Message = {
        id: `m${Date.now()}`,
        content: message,
        senderId: senderId,
        timestamp: new Date().toISOString(),
        status: 'sent'
      }
  
      setMessages(prev => [...prev, newMessage])
      setMessage('')
      //console.error('WebSocket is not connected')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePaymentComplete = (amount: number) => {
    if (!selectedContact) return

    const newTransaction: Transaction = {
      amount,
      receiverName: selectedContact.name,
      timestamp: new Date().toISOString(),
    }

    setTransactions(prev => [...prev, newTransaction])
  }
  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background dark:bg-gray-800">
        <p className="text-text-light dark:text-gray-400 text-center">Select a contact to start chatting</p>
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col h-screen bg-background dark:bg-gray-800">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-surface dark:bg-gray-900 border-b border-border dark:border-gray-700 shadow-sm">
        <div className="flex items-center">
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setShowContactInfo(!showContactInfo)}
              className="group relative focus:outline-none"
            >
              <AnimatedAvatar
                src={selectedContact.avatar}
                alt={selectedContact.name}
                fallback={selectedContact.name.charAt(0)}
              />
              <span className="absolute inset-0 rounded-full ring-2 ring-transparent group-hover:ring-primary dark:group-hover:ring-blue-500 transition-all duration-200" />
            </button>

            {/* Contact Info Popover */}
            <AnimatePresence>
              {showContactInfo && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowContactInfo(false)}
                  />
                  
                  {/* Info Box */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 z-50 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-text dark:text-gray-200">
                          Contact Info
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowContactInfo(false)}
                          className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <AtSign className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-text-light dark:text-gray-400">
                            {selectedContact.username || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-text-light dark:text-gray-400">
                            {selectedContact.phone || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-text dark:text-gray-200">{selectedContact.name}</h2>
            <p className="text-sm text-text-light dark:text-gray-400">online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="btn-secondary bg-green-500 hover:bg-green-600 text-white"
            onClick={() => setShowPaymentModal(true)}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Pay
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="btn-accent bg-purple-500 hover:bg-purple-600 text-white"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Request
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-light dark:text-gray-400 hover:bg-hover dark:hover:bg-gray-700 rounded-full transition-colors group relative"
          >
            <MoreVertical className="h-5 w-5" />
            <span className="absolute -bottom-8 right-0 px-2 py-1 bg-surface dark:bg-gray-800 text-xs text-text dark:text-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Menu
            </span>
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 'user123' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.senderId === 'user123' 
                  ? 'bg-primary dark:bg-blue-600 text-white' 
                  : 'bg-surface dark:bg-gray-700 text-text dark:text-gray-200 border border-border dark:border-gray-600'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] opacity-70">
                  {format(new Date(msg.timestamp), 'HH:mm')}
                </span>
                {msg.senderId === 'user123' && (
                  <Check className="h-3 w-3 opacity-70" />
                )}
              </div>
            </div>
          </div>
        ))}
        {transactions.map((transaction, index) => (
          <div key={index} className={`flex ${transaction.receiverName === selectedContact.name ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg px-4 py-2 max-w-[70%] cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
              <p className="text-sm text-green-800 dark:text-green-200">
                {transaction.receiverName === selectedContact.name 
                  ? `Paid $${transaction.amount.toFixed(2)} to ${transaction.receiverName}`
                  : `Received $${transaction.amount.toFixed(2)} from ${transaction.receiverName}`
                }
              </p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-green-700 dark:text-green-300 opacity-70">
                  {format(new Date(transaction.timestamp), 'HH:mm')}
                </span>
                <Check className="h-3 w-3 text-green-700 dark:text-green-300 opacity-70" />
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 bg-surface dark:bg-gray-900 border-t border-border dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow rounded-full border-border dark:border-gray-600 focus:ring-primary focus:border-primary bg-background dark:bg-gray-800 text-text dark:text-gray-200"
          />
          <Button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="rounded-full p-2 btn-primary bg-primary hover:bg-primary-light dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          receiverId={selectedContact.id}
          receiverName={selectedContact.name}
          senderId={senderId}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  )
}

