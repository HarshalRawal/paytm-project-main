'use client'

import { useState, useEffect, useCallback} from 'react'
import { Wallet, CreditCard, DollarSign, RefreshCw, Sun, Moon, X, ArrowRightLeft, ArrowDownRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBalance } from '@/store/useBalance'
import axios from 'axios'
import { TopUpRequest, WithDrawRequest } from '@/lib/topUpAndWithDrawRequest'
import { RecentTransactions } from '@/components/RecentTransactions'
import { Transaction, usePaginationStore } from '@/store/usePaginationState'  
import { useWebSocketStore } from '@/store/webSocketStore'
import { useRouter } from 'next/navigation'
export default function WalletComponent() {
  const router = useRouter()  // Use useRouter hook

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
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [isRedirect, setIsRedirect] = useState<boolean | null>(null);


  const userId = "3291280e-5400-490d-8865-49f6591c249c";
  const walletId = '80f7b7c0-d495-430f-990d-49e3c5ddc160';

  const {connect} = useWebSocketStore()
   useEffect(()=>{
    connect(userId);
   },[connect])
  useEffect(() => {
    // Extract the `redirect` query parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect") === "true";
    console.log('Redirect:', redirect);
    setIsRedirect(redirect);
  }, []);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])
  const token = "your-access-token";
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const fetchTransactions = useCallback(async (newCursor: string | null = null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      console.log(token);

      if(!token){
        alert("token not found ");
        router.push('/signin')
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`, 
      }

      const response = await axios.get('http://localhost:8080/transactions', {
     
        params: {
          walletId,
          cursor: newCursor,
          limit: 5,
        },
        headers,
      });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const { transactions: newTransactions, nextCursor } = data;
      console.log("response", response);  
      console.log("data", data);
      console.log("Fetched transactions:", newTransactions);
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
    if (isRedirect === null) {
      // Skip until isRedirect is initialized
      return;
    }
  
    if (!isRedirect) {
      console.log(isRedirect);
      console.log('fetching initial balance and transactions');
      
      const fetchUserBalance = async () => {
        await fetchBalance(userId);
      };
  
      fetchUserBalance();
      fetchTransactions();
    } else {
      setLoading(true);
    }
  }, [isRedirect, userId, walletId, fetchBalance, setLoading, fetchTransactions]);
     useEffect(()=>{
      if(isRedirect==null){
        return;
      }
      if(isRedirect){
         const newUrl = window.location.pathname; // This will remove the query parameters
        window.history.pushState({}, '', newUrl);
      }
     },[isRedirect])

  const handleLoadMore = () => {
    if (hasNextPage && !transactionsLoading) {
      fetchTransactions(cursor);
    }
  };
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

  const submitTopUp = async() => {
    const token = localStorage.getItem("authToken");
      console.log(token);

      if(!token){
        
        router.push('/signin')
        return;
      }

    const amount = parseFloat(topUpAmount)
    if (!isNaN(amount) && amount > 0) {
      TopUpRequest({userId, walletId, amount ,token });
      closeTopUpModal()
    }
  }

  const handleWithdraw = () => {
    setShowWithdrawModal(true)
  }

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false)
    setWithdrawAmount('')
  }

  const submitWithdraw = async() => {

    const token = localStorage.getItem("authToken");
      console.log(token);

      if(!token){
        router.push('/signin')
        return;
      }

    const amount = parseFloat(withdrawAmount)
    if (!isNaN(amount) && amount > 0) {
      if (balance === 0) {
        alert("You cannot withdraw money when your balance is zero.")
        return
      }
      if(balance !=null){
        if (amount > balance) {
          alert("You cannot withdraw more than your current balance.")
          return
        }
      }
      
      const userId = '3291280e-5400-490d-8865-49f6591c249c';
      const walletId = '80f7b7c0-d495-430f-990d-49e3c5ddc160'
      WithDrawRequest({userId, walletId, amount , token});
      closeWithdrawModal()
    }
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
              <div className="balance-display">
                {balanceLoading ? (
                  <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">Loading...</p>
                ) : balanceError ? (
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{balanceError}</p>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ${balance !== null && balance !== undefined ? balance : "N/A"}
                    </p>
                    {showExchangeRate && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {/* Exchange rate logic here */}
                      </p>
                    )}
                  </>
                )}
              </div>

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
              className="rounded-lg bg-blue-50 p-6 dark:bg-gray-700"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Actions</h2>
                <div className="flex space-x-2">
                  <CreditCard className="text-green-500 dark:text-green-400" size={24} />
                  <ArrowDownRight className="text-red-500 dark:text-red-400" size={24} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleTopUp}
                  className="group relative w-full overflow-hidden rounded-lg bg-green-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  <span className="relative z-10">Top Up</span>
                  <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 transform opacity-0 transition-all duration-300 group-hover:right-3 group-hover:opacity-100" size={20} />
                </button>
                <button
                  onClick={handleWithdraw}
                  className="group relative w-full overflow-hidden rounded-lg bg-red-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  <span className="relative z-10">Withdraw</span>
                  <ArrowDownRight className="absolute right-4 top-1/2 -translate-y-1/2 transform opacity-0 transition-all duration-300 group-hover:right-3 group-hover:opacity-100" size={20} />
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <RecentTransactions 
              transactions={transactions}
              loading={transactionsLoading}
              hasNextPage={hasNextPage}
              onLoadMore={handleLoadMore}
            />
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
        {showWithdrawModal && (
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
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Withdraw from Your Wallet</h2>
                <button onClick={closeWithdrawModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X size={24} />
                </button>
              </div>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                className="mb-4 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={submitWithdraw}
                disabled={  balance == null||parseFloat(withdrawAmount) > balance || balance === 0}
                className="w-full rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Withdraw
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

