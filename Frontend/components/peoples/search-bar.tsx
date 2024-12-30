'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery)
  }

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
      <Input
        type="text"
        placeholder="Search people..."
        value={query}
        onChange={handleSearch}
        className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border-zinc-700 text-zinc-100 
                   placeholder-zinc-500 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600/50 
                   rounded-xl transition-all duration-300"
      />
    </motion.div>
  )
}

