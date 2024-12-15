'use client'

import { useState, useEffect, useRef } from 'react'
import { Wallet, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw, Sun, Moon, X, ArrowRightLeft, Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WalletButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [balance, setBalance] = useState(1000)
  const [previousBalance, setPreviousBalance] = useState(1000)
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
  const [notification, setNotification] = useState(null)
  const walletRef = useRef(null)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (walletRef.current && !walletRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (balance !== previousBalance) {
      const difference = balance - previousBalance
      setNotification({
        message: `Balance ${difference > 0 ? 'increased' : 'decreased'} by $${Math.abs(difference).toFixed(2)}`,
        type: difference > 0 ? 'credit' : 'debit'
      })
      setTimeout(() => setNotification(null), 3000)
      setPreviousBalance(balance)
    }
  }, [balance, previousBalance])

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
      setBalance(prevBalance => prevBalance + Math.random() * 100)
    }, 1500)
  }

  const toggleExchangeRate = () => {
    setShowExchangeRate(!showExchangeRate)
  }

  const buttonVariants = {
    hover: { scale: 1.1, rotate: 15 },
    tap: { scale: 0.9, rotate: -15 }
  }

  const expandVariants = {
    closed: { opacity: 0, scale: 0.8, y: -20 },
    open: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  }

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <div className="fixed top-4 right-4 z-50" ref={walletRef}>
      <motion.button
        className="rounded-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open wallet"
      >
        <Wallet size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={expandVariants}
            className="absolute right-0 mt-2 w-96 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Your Wallet</h2>
              <button
                onClick={toggleDarkMode}
                className="text-gray-600 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <motion.div animate={{ rotate: isDarkMode ? 180 : 0 }} transition={{ duration: 0.5 }}>
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              </button>
            </div>

            <motion.div 
              className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-gray-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Balance</h3>
                <Wallet className="text-blue-500 dark:text-blue-400" size={20} />
              </div>
              <motion.p 
                className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                key={balance}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                ${balance.toFixed(2)}
              </motion.p>
              <AnimatePresence>
                {showExchangeRate && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                  >
                    ≈ €{(balance * exchangeRate).toFixed(2)}
                  </motion.p>
                )}
              </AnimatePresence>
              <button
                onClick={toggleExchangeRate}
                className="mt-1 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowRightLeft size={12} className="inline mr-1" />
                {showExchangeRate ? "Hide" : "Show"} exchange rate
              </button>
            </motion.div>

            <div className="mb-6">
              <motion.button
                onClick={handleTopUp}
                className="w-full rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Top Up
              </motion.button>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Transactions</h3>
              <motion.div 
                className="space-y-2 max-h-40 overflow-y-auto"
                variants={listVariants}
                initial="hidden"
                animate="show"
              >
                {transactions.map((transaction) => (
                  <motion.div 
                    key={transaction.id} 
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-2 text-sm dark:bg-gray-700"
                    variants={listItemVariants}
                  >
                    <div className="flex items-center space-x-2">
                      {transaction.type === 'credit' ? (
                        <ArrowUpRight className="text-green-500 dark:text-green-400" size={16} />
                      ) : (
                        <ArrowDownRight className="text-red-500 dark:text-red-400" size={16} />
                      )}
                      <span className="text-gray-600 dark:text-gray-300">{transaction.date}</span>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.button 
              onClick={refreshBalance}
              disabled={isRefreshing}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={16} className={`inline mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Balance'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

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
                <motion.button 
                  onClick={closeTopUpModal} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
                className="mb-4 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <motion.button
                onClick={submitTopUp}
                className="w-full rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Confirm Top Up
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full ${
              notification.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
            } text-white text-sm font-semibold shadow-lg`}
          >
            <Bell size={16} className="inline-block mr-2" />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}