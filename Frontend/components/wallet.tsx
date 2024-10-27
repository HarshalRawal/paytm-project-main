'use client'

import { useState, useEffect } from 'react'
import { Wallet, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw, Sun, Moon, X, ArrowRightLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WalletComponent() {
  const [balance, setBalance] = useState(1000)
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', amount: 500, date: '2023-05-15' },
    { id: 2, type: 'debit', amount: 200, date: '2023-05-14' },
    { id: 3, type: 'credit', amount: 1000, date: '2023-05-13' },
  ])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [exchangeRate, setExchangeRate] = useState(1.2) // USD to EUR rate
  const [showExchangeRate, setShowExchangeRate] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleTopUp = () => {
    setShowTopUpModal(true)
  }

  const closeTopUpModal = () => {
    setShowTopUpModal(false)
    setTopUpAmount('')
  }

  const submitTopUp = () => {
    const amount = parseFloat(topUpAmount)
    if (!isNaN(amount) && amount > 0) {
      setBalance(prevBalance => prevBalance + amount)
      setTransactions(prevTransactions => [
        { id: Date.now(), type: 'credit', amount, date: new Date().toISOString().split('T')[0] },
        ...prevTransactions
      ])
      closeTopUpModal()
    }
  }

  const refreshBalance = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      // Simulating balance update
      setBalance(prevBalance => prevBalance + Math.random() * 100)
    }, 1500)
  }

  const toggleExchangeRate = () => {
    setShowExchangeRate(!showExchangeRate)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 transition-colors duration-300 dark:bg-gray-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl dark:bg-gray-800"
      >
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <motion.h1 
              className="text-3xl font-semibold text-blue-500 dark:text-blue-400"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              Your Wallet
            </motion.h1>
            <button
              onClick={toggleDarkMode}
              className="text-gray-600 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDarkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </motion.div>
            </button>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <motion.div 
              className="rounded-lg bg-blue-50 p-6 dark:bg-gray-700"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Balance</h2>
                <Wallet className="text-blue-500 dark:text-blue-400" size={24} />
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${balance.toFixed(2)}</p>
              {showExchangeRate && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  ≈ €{(balance * exchangeRate).toFixed(2)}
                </p>
              )}
              <button
                onClick={toggleExchangeRate}
                className="mt-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                aria-label={showExchangeRate ? "Hide exchange rate" : "Show exchange rate"}
              >
                <ArrowRightLeft size={16} className="inline mr-1" />
                {showExchangeRate ? "Hide" : "Show"} exchange rate
              </button>
            </motion.div>
            <motion.div 
              className="rounded-lg bg-green-50 p-6 dark:bg-gray-700"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Top Up</h2>
                <CreditCard className="text-green-500 dark:text-green-400" size={24} />
              </div>
              <button
                onClick={handleTopUp}
                className="group relative w-full overflow-hidden rounded-lg bg-green-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              >
                <span className="relative z-10">Request Top Up</span>
                <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 transform opacity-0 transition-all duration-300 group-hover:right-3 group-hover:opacity-100" size={20} />
              </button>
            </motion.div>
          </div>

          <motion.div 
            className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  <div className="flex items-center space-x-4">
                    {transaction.type === 'credit' ? (
                      <ArrowUpRight className="text-green-500 dark:text-green-400" size={24} />
                    ) : (
                      <ArrowDownRight className="text-red-500 dark:text-red-400" size={24} />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {transaction.type === 'credit' ? 'Received' : 'Sent'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="mt-8 text-center">
            <button 
              onClick={refreshBalance}
              disabled={isRefreshing}
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Balance'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showTopUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Top Up Your Wallet</h2>
                <button onClick={closeTopUpModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X size={24} />
                </button>
              </div>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
                className="mb-4 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={submitTopUp}
                className="w-full rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              >
                Confirm Top Up
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}