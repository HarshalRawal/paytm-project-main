import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Transaction}  from '@/store/usePaginationState'
export function Transaction({
  id,
  amount,
  status,
  transactionType,
  from,
  to,
  walletId,
  createdAt,
  updatedAt
}: Transaction) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-500'
      case 'FAILED':
        return 'text-red-500'
      default:
        return 'text-yellow-500'
    }
  }

  const getTypeIcon = (type:string) => {
    switch (type) {
      case 'TOP_UP':
      case 'P2P':
        return <ArrowUpRight className="text-green-500 dark:text-green-400" size={24} />
      case 'WITHDRAWAL':
        return <ArrowDownRight className="text-red-500 dark:text-red-400" size={24} />
    }
  }
  function convertTo12HourFormat(time: string) {
    // Split the time string into hours, minutes, and seconds
    const [hour, minute, second] = time.split(':').map(Number);

    // Determine AM or PM
    const period = hour >= 12 ? 'PM' : 'AM';

    // Convert hour to 12-hour format
    const hour12 = hour % 12 || 12;

    // Format the result
    return `${hour12}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} ${period}`;
}
  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <div className="flex items-center space-x-4">
          {getTypeIcon(transactionType)}
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {transactionType.charAt(0) + transactionType.slice(1).toLowerCase().replace('_', ' ')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {convertTo12HourFormat(new Date(createdAt).toLocaleTimeString())}
            </p>
            <p className={`text-sm ${getStatusColor(status)}`}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <p className={`font-semibold ${
            transactionType === 'WITHDRAWAL' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'
          }`}>
            {transactionType === 'WITHDRAWAL' ? '-' : '+'}${amount}
          </p>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        </div>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="space-y-2">
              <p><strong>ID:</strong> {id}</p>
              <p><strong>Amount:</strong> ${amount}</p>
              <p><strong>Status:</strong> <span className={getStatusColor(status)}>{status}</span></p>
              <p><strong>Type:</strong> {transactionType.replace('_', ' ')}</p>
              {from && <p><strong>From:</strong> {from}</p>}
              {to && <p><strong>To:</strong> {to}</p>}
              <p><strong>Wallet ID:</strong> {walletId}</p>
              <p><strong>Created At:</strong> {convertTo12HourFormat(new Date(createdAt).toLocaleTimeString())}</p>
              <p><strong>Updated At:</strong> {convertTo12HourFormat(new Date(updatedAt).toLocaleTimeString())}</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}
