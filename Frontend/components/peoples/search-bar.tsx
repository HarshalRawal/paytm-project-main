'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { colors } from '@/styles/colors'

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
    <div className="px-3 py-2" style={{ backgroundColor: colors.surface }}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search or start new chat"
          value={query}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-1.5 text-zinc-200 text-sm rounded-lg border-0 focus-visible:ring-0"
          style={{ 
            backgroundColor: colors.inputBackground,
            color: colors.textPrimary,
          }}
        />
      </div>
    </div>
  )
}

