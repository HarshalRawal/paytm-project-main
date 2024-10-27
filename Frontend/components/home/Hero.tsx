'use client'

import { motion } from 'framer-motion'
import { DollarSign, Wallet, PiggyBank, CreditCard, Coins, Receipt } from 'lucide-react'

export default function Hero() {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 0.2, 
      scale: 1,
      transition: { 
        duration: 0.5,
        yoyo: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="hero bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-white py-32 transition-colors duration-500 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div 
            className="max-w-4xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
              animate={{ 
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Revolutionize Your{' '}
              Payments{' '}
              with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-400">
                PayEase
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-3xl mb-12 text-indigo-100 font-light"
              animate={{ 
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Experience lightning-fast, secure, and user-friendly payment solutions designed for modern businesses and individuals.
            </motion.p>
            <motion.button 
              className="px-10 py-5 bg-white text-indigo-600 rounded-full text-xl font-bold transition-all duration-300 shadow-lg hover:bg-indigo-100 hover:text-indigo-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(255,255,255,0.5)", "0px 0px 20px rgba(255,255,255,0.5)", "0px 0px 0px rgba(255,255,255,0.5)"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Start Your Free Trial
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* 3D Animated Background Icons */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-white"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <DollarSign size={80} />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 text-indigo-300"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <Wallet size={100} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-300"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <PiggyBank size={300} />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/5 text-green-300"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <CreditCard size={120} />
      </motion.div>
      <motion.div
        className="absolute bottom-1/5 left-1/5 text-yellow-300"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <Coins size={150} />
      </motion.div>
      <motion.div
        className="absolute top-1/5 right-1/3 text-red-300"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <Receipt size={90} />
      </motion.div>
    </section>
  )
}