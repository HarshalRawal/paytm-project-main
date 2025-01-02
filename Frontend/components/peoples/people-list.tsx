'use client'

import { useState, useEffect } from 'react'
import { useContactsStore, Person } from '@/store/useContact'
import { SearchBar } from './search-bar'
import { AnimatedAvatar } from './animated-avatar'
import { AddContactForm } from './add-contact-form'
import { Button } from '@/components/ui/button'
import { UserPlus, MoreVertical } from 'lucide-react'
import { getChatForContact } from '@/data/chats'
import { format } from 'date-fns'

export function PeopleList({ onSelectContact }: { onSelectContact: (person: Person) => void }) {
  const { contacts, fetchContacts } = useContactsStore()
  const [filteredContacts, setFilteredContacts] = useState<Person[]>([])
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

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

  const handleSelectContact = (person: Person) => {
    setSelectedId(person.id)
    onSelectContact(person)
  }

  const getLastMessage = (personId: string) => {
    const chat = getChatForContact(personId)
    if (!chat?.messages.length) return null
    return chat.messages[chat.messages.length - 1]
  }

  return (
    <div className="w-[350px] flex flex-col h-screen border-r border-border bg-white dark:bg-gray-900 shadow-lg text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">People</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddContactOpen(true)}
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <UserPlus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group relative"
          >
            <MoreVertical className="h-5 w-5" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Menu
            </span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar onSearch={handleSearch} />

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((person) => {
          const lastMessage = getLastMessage(person.id)
          return (
            <div
              key={person.id}
              className={`relative cursor-pointer transition-all duration-200 ease-in-out ${
                selectedId === person.id 
                  ? 'bg-gray-100 dark:bg-gray-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleSelectContact(person)}
            >
              <div className="relative z-10 flex items-center px-4 py-3">
                <AnimatedAvatar
                  src={person.avatar}
                  alt={person.name}
                  fallback={person.name.charAt(0)}
                />
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h2 className="text-[15px] font-medium truncate text-gray-900 dark:text-gray-200">
                      {person.name}
                    </h2>
                    {lastMessage && (
                      <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                        {format(new Date(lastMessage.timestamp), 'HH:mm')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm truncate text-gray-500 dark:text-gray-400">
                    {lastMessage ? lastMessage.content : 'No messages yet'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Contact Modal */}
      {isAddContactOpen && (
        <AddContactForm onClose={() => setIsAddContactOpen(false)} />
      )}
    </div>
  )
}

  