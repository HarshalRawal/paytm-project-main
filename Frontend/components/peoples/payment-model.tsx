'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Loader2 } from 'lucide-react'
import { checkWalletBalance } from '@/lib/p2pPayment'
import { P2pPaymentRequest } from '@/lib/p2pPayment'

interface PaymentModalProps {
  onClose: () => void
  senderId: string
  receiverId: string
  receiverName: string
  onPaymentComplete: (amount: number) => void
}

interface ResponseData {
  success?: boolean
  message?: string
  error?: string
}

export function PaymentModal({ onClose, receiverId, receiverName, senderId, onPaymentComplete }: PaymentModalProps) {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'amount' | 'pin'>('amount')
  const [errorMessage, setErrorMessage] = useState('')

  const handleNext = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const responseData: ResponseData = await checkWalletBalance(senderId, Number(amount))
      const { success, message } = responseData

      if (success === true) {
        setStep('pin')
      } else {
        console.log('Insufficient balance')
        setErrorMessage(message || 'Insufficient balance')
      }
    } catch (error) {
      setErrorMessage('Failed to process request. Please try again.')
      console.error('Error checking wallet balance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await P2pPaymentRequest({
        senderId,
        receiverId,
        amount: Number(amount),
        message,
        pin: Number(pin)
      })
      console.log("P2p payment request sent successfully: >>> ", response)
      onPaymentComplete(Number(amount))
      onClose()
    } catch (error) {
      console.error("Error communicating with the WalletServer:", error)
      setErrorMessage('Failed to process payment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step === 'amount' ? `Pay to ${receiverName}` : 'Enter PIN'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-4">
          {step === 'amount' ? (
            <>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message (optional)
                </label>
                <Input
                  id="message"
                  type="text"
                  placeholder="Add a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                />
              </div>
              <Button
                onClick={handleNext}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={!amount.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking balance...
                  </>
                ) : (
                  'Next'
                )}
              </Button>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enter 4-digit PIN
                </label>
                <Input
                  id="pin"
                  type="password"
                  maxLength={4}
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 text-center text-2xl tracking-widest"
                />
              </div>
              <Button
                onClick={handlePinSubmit}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={pin.length !== 4 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing payment...
                  </>
                ) : (
                  'Confirm Payment'
                )}
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

