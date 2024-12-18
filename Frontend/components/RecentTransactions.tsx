import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { motion } from 'framer-motion'

export interface Transaction {
  id: number
  type: 'top-up' | 'withdrawal' | 'p2p'
  amount: number
  date: string
  status: 'successful' | 'failed'
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">Recent Transactions</h2>
      <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            <div className="flex items-center space-x-4">
              {transaction.type === 'top-up' || transaction.type === 'p2p' ? (
                <ArrowUpRight className="text-green-500 dark:text-green-400" size={24} />
              ) : (
                <ArrowDownRight className="text-red-500 dark:text-red-400" size={24} />
              )}
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.date}</p>
                <p className={`text-sm ${
                  transaction.status === 'successful' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </p>
              </div>
            </div>
            <p className={`font-semibold ${
              transaction.type === 'withdrawal' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'
            }`}>
              {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

