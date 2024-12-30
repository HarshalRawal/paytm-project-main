'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { people, Person } from '@/data/people'
import { ChatSection } from './chat-section'
import { SearchBar } from './search-bar'
import { AnimatedAvatar } from './animated-avatar'

export function PeopleList() {
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people)
  const [openChats, setOpenChats] = useState<{ [key: string]: boolean }>({})

  const handleSearch = (query: string) => {
    const filtered = people.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredPeople(filtered)
  }

  const toggleChat = (personId: string) => {
    setOpenChats(prev => ({
      ...prev,
      [personId]: !prev[personId]
    }))
  }

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800">
      <div className="p-6 space-y-4">
        <SearchBar onSearch={handleSearch} />
        <motion.div className="space-y-3">
          {filteredPeople.map((person) => (
            <motion.div
              key={person.id}
              className="relative group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="rounded-xl p-4 bg-zinc-800/50 hover:bg-zinc-800 
                          transition-all duration-300 cursor-pointer
                          border border-zinc-700 hover:border-zinc-600"
                onClick={() => toggleChat(person.id)}
              >
                <div className="flex items-center">
                  <AnimatedAvatar
                    src={person.avatar}
                    alt={person.name}
                    fallback={person.name.charAt(0)}
                  />
                  <h2 className="text-lg font-medium text-zinc-100 ml-3 group-hover:text-white">
                    {person.name}
                  </h2>
                </div>
                <AnimatePresence>
                  {openChats[person.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <ChatSection personName={person.name} onClose={() => toggleChat(person.id)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

