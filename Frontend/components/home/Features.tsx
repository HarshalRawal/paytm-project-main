'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CreditCard, Shield, Repeat, Globe, BarChart2, Zap } from 'lucide-react'

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  const features = [
    { icon: <CreditCard size={40} />, title: "Easy Transactions", description: "Send and receive money with just a few taps." },
    { icon: <Shield size={40} />, title: "Secure Payments", description: "Bank-level encryption keeps your money safe." },
    { icon: <Repeat size={40} />, title: "Instant Transfers", description: "Transfer funds in real-time, 24/7." },
    { icon: <Globe size={40} />, title: "Global Reach", description: "Send money to over 200 countries worldwide." },
    { icon: <BarChart2 size={40} />, title: "Financial Insights", description: "Track your spending and manage your budget effortlessly." },
    { icon: <Zap size={40} />, title: "Lightning Fast", description: "Experience the fastest payment processing in the industry." },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }

  return (
    <section id="features" className="features py-20 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Why Choose PayEase?
        </motion.h2>
        <motion.div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl border border-indigo-100 dark:border-gray-700"
              variants={itemVariants}
            >
              <motion.div 
                className="text-indigo-500 dark:text-indigo-400 mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}