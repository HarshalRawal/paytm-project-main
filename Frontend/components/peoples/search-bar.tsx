'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

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
    <div className="px-4 py-3 bg-surface border-b border-border">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light h-4 w-4" />
        <Input
          type="text"
          placeholder="Search or start new chat"
          value={query}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 text-text text-sm rounded-full border-border focus:ring-primary focus:border-primary bg-background"
        />
      </div>
    </div>
  )
}

