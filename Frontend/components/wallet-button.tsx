'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Wallet, CreditCard, DollarSign, RefreshCw, Sun, Moon, X, ArrowRightLeft, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBalance } from '@/store/useBalance'
import axios from 'axios'
//import useWebSocket from '@/store/useWebhook'
import { TopUpRequest, WithDrawRequest } from '@/lib/topUpRequest'
import { Transaction, usePaginationStore } from '@/store/usePaginationState'
import { useRouter } from 'next/navigation'

export default function WalletButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { balance, loading: balanceLoading, error: balanceError, fetchBalance } = useBalance();
  const {
    transactions,
    cursor,
    loading: transactionsLoading,
    hasNextPage,
    setTransactions,
    setLoading,
    setCursor,
    setHasNextPage,
  } = usePaginationStore();

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [showExchangeRate, setShowExchangeRate] = useState(false)
  const walletRef = useRef(null)
  const router = useRouter()

  const userId = "3291280e-5400-490d-8865-49f6591c249c";
  const walletId = '80f7b7c0-d495-430f-990d-49e3c5ddc160';
  //useWebSocket(userId);
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const fetchTransactions = useCallback(async (newCursor: string | null = null) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/transactions', {
        params: {
          walletId,
          cursor: newCursor,
          limit: 5,
        },
      });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const { transactions: newTransactions, nextCursor } = data;
      setTransactions((prevTransactions: Transaction[]) => 
        newCursor ? [...prevTransactions, ...newTransactions] : newTransactions
      );
      setCursor(nextCursor);
      setHasNextPage(!!nextCursor);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [walletId, setTransactions, setCursor, setHasNextPage, setLoading]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        await fetchBalance(userId);
        await fetchTransactions();
      };
      fetchData();
    }
  }, [isOpen, userId, fetchBalance, fetchTransactions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (walletRef.current && !walletRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleTopUp = () => {
    router.push('/wallet?redirect=true')
  }

  const refreshBalance = () => {
    setIsRefreshing(true)
    fetchBalance(userId).finally(() => {
      setIsRefreshing(false)
    })
  }

  const toggleExchangeRate = () => {
    setShowExchangeRate(!showExchangeRate)
  }

  const buttonVariants = {
    hover: { scale: 1.1, rotate: 15 },
    tap: { scale: 0.9, rotate: -15 }
  }

  const expandVariants = {
    closed: { opacity: 0, x: '100%', height: 0 },
    open: { 
      opacity: 1, 
      x: 0, 
      height: 'auto',
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 25,
        height: { duration: 0.4 }
      } 
    }
  }

  return (
    <div className="relative inline-block" ref={walletRef}>
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
            className="absolute left-0 mt-2 w-96 overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800"
          >
            <div className="p-4">
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
                  ${balance !== null && balance !== undefined ? balance.toFixed(2) : "Loading..."}
                </motion.p>
                <AnimatePresence>
                  {showExchangeRate && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                    >
                      ≈ €{((balance || 0) * 1.2).toFixed(2)}
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
                <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Recent Transactions</h3>
                <div className="space-y-2">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-2 text-xs dark:bg-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        {transaction.transactionType === 'TOP_UP' && (
                          <ArrowUpRight className="text-green-500 dark:text-green-400" size={16} />
                        )}
                        {transaction.transactionType === 'WITHDRAWAL' && (
                          <ArrowDownRight className="text-red-500 dark:text-red-400" size={16} />
                        )}
                        {transaction.transactionType === 'P2P_TRANSFER' && (
                          <ArrowRightLeft className="text-blue-500 dark:text-blue-400" size={16} />
                        )}
                        <span className="font-medium">
                          {transaction.transactionType === 'TOP_UP' ? 'Credit' : 
                           transaction.transactionType === 'WITHDRAWAL' ? 'Debit' : 
                           'P2P'}
                        </span>
                      </div>
                      <span className={`font-semibold ${
                        transaction.transactionType === 'TOP_UP' ? 'text-green-500 dark:text-green-400' : 
                        transaction.transactionType === 'WITHDRAWAL' ? 'text-red-500 dark:text-red-400' : 
                        'text-blue-500 dark:text-blue-400'
                      }`}>
                        {transaction.transactionType === 'TOP_UP' ? '+' : 
                         transaction.transactionType === 'WITHDRAWAL' ? '-' : ''}
                        ${transaction.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button 
                onClick={refreshBalance}
                disabled={isRefreshing}
                className="w-full rounded-lg bg-blue-500 px-3 py-1 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={16} className={`inline mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Balance'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

