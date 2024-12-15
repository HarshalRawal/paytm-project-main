'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import Header from '@/components/home/Header'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import HowItWorks from '@/components/home/HowItWork'
import Testimonials from '@/components/home/Testimonials'
import AppShowcase from '@/components/home/AppShowCase'
import CTA from '@/components/home/CTA'
import Footer from '@/components/home/Footer'

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

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

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isDarkMode ? 'dark' : 'light'}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className={`min-h-screen ${
          isDarkMode
            ? 'bg-gradient-to-b from-gray-900 to-black text-gray-100'
            : 'bg-gradient-to-b from-gray-100 to-white text-gray-900'
        } transition-colors duration-500`}
      >
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50"
          style={{ scaleX }}
        />
        <Header 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
          isLoggedIn={isLoggedIn}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <Testimonials />
          <AppShowcase />
          <CTA />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  )
}