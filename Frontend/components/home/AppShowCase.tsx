'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AppShowcase() {
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 0px 8px rgb(99, 102, 241)" },
    tap: { scale: 0.95 }
  }

  return (
    <section id="download" className="app-showcase bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Experience PayEase on the Go</h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">Download our mobile app and take control of your finances anytime, anywhere.</p>
            <div className="flex space-x-4">
              <motion.button 
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 flex items-center"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                App Store
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 flex items-center"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-1.392 0 .988.988 0 0 1 0-1.39L10.61 12 2.218 3.203a.988.988 0 0 1 0-1.389.996.996 0 0 1 1.39 0zm6.174 0L20 12 9.783 22.186a.996.996 0 0 1-1.391 0 .988.988 0 0 1 0-1.39L17.61 12 8.392 3.203a.988.988 0 0 1 0-1.389.996.996 0 0 1 1.39 0z"/></svg>
                Google Play
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <Image src="/placeholder.svg" alt="PayEase Mobile App" width={300} height={600} className="mx-auto rounded-3xl shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}