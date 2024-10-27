'use client'

import { motion } from 'framer-motion'

export default function CTA() {
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 0px 8px rgb(99, 102, 241)" },
    tap: { scale: 0.95 }
  }

  return (
    <section className="cta bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ready to Simplify Your Payments?
        </motion.h2>
        <motion.p 
          className="text-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Join thousands of satisfied users and experience the future of payments today.
        </motion.p>
        <motion.button 
          className="px-8 py-4 bg-white text-indigo-600 rounded-full text-lg font-semibold hover:bg-indigo-100 transition-colors duration-300"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Sign Up Now
        </motion.button>
      </div>
    </section>
  )
}