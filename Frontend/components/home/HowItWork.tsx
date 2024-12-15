'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function HowItWorks() {


  return (
    <section id="how-it-works" className="how-it-works py-20 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          How PayEase Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: 1, title: "Create an Account", description: "Sign up for free in minutes and verify your identity." },
            { step: 2, title: "Add Funds", description: "Link your bank account or add money via credit/debit card." },
            { step: 3, title: "Start Transacting", description: "Send money, pay bills, or shop online with ease." },
          ].map((item, index) => {
            const ref = useRef(null);
            const isInView = useInView(ref, { once: true, amount: 0.2 });

            return (
              <motion.div
                key={index}
                ref={ref}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl border border-indigo-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white flex items-center justify-center text-2xl font-bold mb-4"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1, rotateY: 360 } : { scale: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{item.title}</h3>
                  <p className="text-center text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}