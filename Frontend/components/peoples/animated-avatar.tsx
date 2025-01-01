'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AnimatedAvatarProps {
  src: string;
  alt: string;
  fallback: string;
}

export function AnimatedAvatar({ src, alt, fallback }: AnimatedAvatarProps) {
  return (
    <Avatar className="h-10 w-10 ring-0">
      <AvatarImage src={src} alt={alt} className="object-cover" />
      <AvatarFallback 
        className="bg-zinc-600 text-zinc-100 font-medium"
        style={{ backgroundColor: '#2a3942' }}
      >
        {fallback}
      </AvatarFallback>
    </Avatar>
  )
}

