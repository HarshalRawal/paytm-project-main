
import React from 'react'
import { motion } from 'framer-motion'

interface LogoProps {
  width?: number
  height?: number
  isDarkMode?: boolean
}

export default function PayEaseLogo({ width = 120, height = 40, isDarkMode = false }: LogoProps) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 }
      }
    }
  }

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
    >
      <motion.path
        d="M10 30V10H25C27.7614 10 30 12.2386 30 15C30 17.7614 27.7614 20 25 20H10"
        stroke={isDarkMode ? "#E0E0E0" : "#4A5568"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
      <motion.path
        d="M35 30V20C35 17.2386 37.2386 15 40 15H50C52.7614 15 55 17.2386 55 20V30"
        stroke={isDarkMode ? "#E0E0E0" : "#4A5568"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
      <motion.path
        d="M35 22.5H55"
        stroke={isDarkMode ? "#E0E0E0" : "#4A5568"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
      <motion.path
        d="M60 15V25C60 27.7614 62.2386 30 65 30H75C77.7614 30 80 27.7614 80 25V15"
        stroke={isDarkMode ? "#E0E0E0" : "#4A5568"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
      <motion.path
        d="M70 25V35"
        stroke={isDarkMode ? "#E0E0E0" : "#4A5568"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
      <motion.circle
        cx="95"
        cy="22.5"
        r="7.5"
        stroke={isDarkMode ? "#E0E0E0" : "#4A5568"}
        strokeWidth="2"
        variants={pathVariants}
      />
      <motion.path
        d="M95 17.5V27.5M92.5 20H97.5M92.5 25H97.5"
        stroke={isDarkMode ? "#E0E0E0" : "#4A5568"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
      <motion.path
        d="M105 15L115 25M115 15L105 25"
        stroke={isDarkMode ? "#E0E0E0" : "#4A5568"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
    </motion.svg>
  )
}