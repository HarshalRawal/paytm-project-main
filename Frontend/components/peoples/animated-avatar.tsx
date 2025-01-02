'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AnimatedAvatarProps {
  src: string;
  alt: string;
  fallback: string;
}

export function AnimatedAvatar({ src, alt, fallback }: AnimatedAvatarProps) {
  return (
    <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-primary transition-all duration-200">
      <AvatarImage src={src} alt={alt} className="object-cover" />
      <AvatarFallback className="bg-primary text-white font-medium dark:bg-gray-700 dark:text-gray-200">
        {fallback}
      </AvatarFallback>
    </Avatar>
  )
}

