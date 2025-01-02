'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Search, UserPlus } from 'lucide-react'
import { useContactsStore,} from '@/store/useContact'
import axios from 'axios'

interface AddContactFormProps {
  onClose: () => void
}

interface User {
  username: string
  email: string
  phone: string
}

async function searchUser(searchParameter: string){
  try {
    const response = await axios.post('http://localhost:8080/api-gateway/search/user', {
      searchParameter: searchParameter
    })
    return response.data
  } catch (error) {
    console.error(`Error searching for user ${searchParameter}: ${error}`)
    return null
  }
}

export function AddContactForm({ onClose }: AddContactFormProps) {
  const [searchParameter, setSearchParameter] = useState('')
  const [searchResult, setSearchResult] = useState<User | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [addContactMessage, setAddContactMessage] = useState('')

  const { addContactToStore } = useContactsStore()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchParameter) return
    setIsSearching(true)
    const result = await searchUser(searchParameter)
    console.log(result?.data.existingUser)
    setSearchResult(result?.data.existingUser)
    setIsSearching(false)
  }

  const handleAddContact = async() => {
    if (searchResult) {
      console.log(`Adding contact: ${searchResult.username}`)
      setIsAddingContact(true)
      try {
        const response = await axios.post('http://localhost:8080/api-gateway/addContact', { 
          contactUsername: searchResult.username,
          userId:`3291280e-5400-490d-8865-49f6591c249c`
         })
        //const responseData = JSON.stringify(response.data)
        const { message,data} = response.data
        console.log(`message: ${message}`);
        console.log(`data: ${JSON.stringify(data)}`)
        console.log(`Error: ${data?.error}`)
        if(data?.error){
            console.log(`User ${searchResult.username} is  already there in your contact list!!!!`)
         setAddContactMessage(data["error"])
        }
       else{
        setAddContactMessage(`Contact added successfully`)
        addContactToStore({
          id: data.id,
          name: data.username,
          phone: data.phone,
          username: data.username,
          avatar: data.profilePicture||'/placeholder.svg?height=40&width=40&text=...',
        })
       }
      } catch (error) {
        console.error(`Error adding contact: ${error}`)
        setAddContactMessage('Failed to add contact. Please try again.')
      }
      setIsAddingContact(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-800"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-zinc-100">Add New Contact</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSearch} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter username or phone number"
            value={searchParameter}
            onChange={(e) => setSearchParameter(e.target.value)}
            className="w-full bg-zinc-800/50 border-zinc-700 text-zinc-100 
                       placeholder-zinc-500 focus:border-zinc-600 focus:ring-2 
                       focus:ring-zinc-600/50 rounded-lg"
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
            <Search className="h-4 w-4 ml-2" />
          </Button>
        </form>
        {isSearching && (
          <p className="text-zinc-400 text-center mt-4">Searching...</p>
        )}
        {searchResult === null && !isSearching && searchParameter !== '' && (
          <p className="text-zinc-400 text-center mt-4">No user found</p>
        )}
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-zinc-800 rounded-lg p-4 border border-zinc-700"
          >
            <h4 className="text-zinc-100 font-medium mb-2">{searchResult.username}</h4>
            <p className="text-zinc-400 text-sm mb-1">Email: {searchResult.email}</p>
            <p className="text-zinc-400 text-sm mb-4">Phone: {searchResult.phone}</p>
            {isAddingContact ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <Button
                onClick={handleAddContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add to Contact
              </Button>
            )}
            {addContactMessage && (
              <p className={`mt-2 text-sm ${addContactMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                {addContactMessage}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}


