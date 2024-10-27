'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const testimonials = [
    { name: "John Doe", role: "Small Business Owner", quote: "PayEase has revolutionized how I manage my business finances. It's incredibly user-friendly and secure." },
    { name: "Jane Smith", role: "Freelancer", quote: "As a freelancer, getting paid used to be a hassle. With PayEase, I receive payments instantly from clients worldwide." },
    { name: "Alex Johnson", role: "Student", quote: "PayEase makes splitting bills with roommates so easy. No more awkward conversations about who owes what!" },
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
    <section id="testimonials" className="testimonials py-20 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Our Users Say
        </motion.h2>
        <motion.div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl border border-indigo-100 dark:border-gray-700"
              variants={itemVariants}
            >
              <p className="mb-4 italic text-gray-600 dark:text-gray-300">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                ></motion.div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}