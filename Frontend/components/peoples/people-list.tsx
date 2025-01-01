'use client'

import { useState, useEffect } from 'react'
import { useContactsStore, Person } from '@/store/useContact'
import { SearchBar } from './search-bar'
import { AnimatedAvatar } from './animated-avatar'
import { AddContactForm } from './add-contact-form'
import { Button } from '@/components/ui/button'
import { UserPlus, MoreVertical } from 'lucide-react'
import { colors } from '@/styles/colors'
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
    <div className="w-[30%] flex flex-col h-screen border-r border-zinc-800" 
         style={{ backgroundColor: colors.surface }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" 
           style={{ backgroundColor: colors.surface }}>
        <AnimatedAvatar
          src="/placeholder.svg?height=40&width=40"
          alt="Your profile"
          fallback="YP"
        />
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddContactOpen(true)}
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:bg-zinc-800/50 rounded-full transition-colors"
          >
            <UserPlus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:bg-zinc-800/50 rounded-full transition-colors group relative"
          >
            <MoreVertical className="h-5 w-5" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-zinc-800 text-xs text-zinc-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
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
              className={`relative cursor-pointer transition-colors duration-200`}
              style={{ 
                backgroundColor: selectedId === person.id ? colors.selected : 'transparent',
              }}
              onClick={() => handleSelectContact(person)}
              onMouseEnter={(e) => {
                if (selectedId !== person.id) {
                  e.currentTarget.style.backgroundColor = colors.hover
                }
              }}
              onMouseLeave={(e) => {
                if (selectedId !== person.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <div className="flex items-center px-4 py-3">
                <AnimatedAvatar
                  src={person.avatar}
                  alt={person.name}
                  fallback={person.name.charAt(0)}
                />
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h2 className="text-[15px] text-zinc-100 font-medium truncate">
                      {person.name}
                    </h2>
                    {lastMessage && (
                      <span className="text-xs text-zinc-500 ml-2">
                        {format(new Date(lastMessage.timestamp), 'HH:mm')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 truncate">
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

