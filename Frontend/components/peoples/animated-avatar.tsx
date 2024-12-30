'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AnimatedAvatarProps {
  src: string;
  alt: string;
  fallback: string;
}

export function AnimatedAvatar({ src, alt, fallback }: AnimatedAvatarProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9, rotate: -5 }}
    >
      <Avatar className="h-12 w-12 ring-2 ring-zinc-700 bg-zinc-800">
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className="bg-zinc-800 text-zinc-300 font-medium">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  )
}

