'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContactsStore, Person } from '@/store/useContact'
import { ChatSection } from './chat-section'
import { SearchBar } from './search-bar'
import { AnimatedAvatar } from './animated-avatar'
import { AddContactForm } from './add-contact-form'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'

export function PeopleList() {
  const { contacts, fetchContacts } = useContactsStore()
  const [filteredContacts, setFilteredContacts] = useState<Person[]>([])
  const [openChats, setOpenChats] = useState<{ [key: string]: boolean }>({})
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  useEffect(() => {
    setFilteredContacts(contacts)
  }, [contacts])

  const handleSearch = (query: string) => {
    const filtered = contacts.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()) ||
      (person.username && person.username.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredContacts(filtered)
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
        <div className="flex justify-between items-center">
          <SearchBar onSearch={handleSearch} />
          <Button
            onClick={() => setIsAddContactOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg ml-4"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add People
          </Button>
        </div>
        <motion.div className="space-y-3">
          {filteredContacts.map((person) => (
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
                  <div className="ml-3">
                    <h2 className="text-lg font-medium text-zinc-100 group-hover:text-white">
                      {person.name}
                    </h2>
                    {person.username && (
                      <p className="text-sm text-zinc-400">username- {person.username}</p>
                    )}
                    {person.phone && (
                      <p className="text-sm text-zinc-400">phone- {person.phone}</p>
                    )}
                  </div>
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
      <AnimatePresence>
        {isAddContactOpen && (
          <AddContactForm
            onClose={() => setIsAddContactOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

