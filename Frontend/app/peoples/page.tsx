'use client'

import { useState } from 'react'
import { PeopleList } from "@/components/peoples/people-list"
import { ChatSection } from "@/components/peoples/chat-section"
import { Person } from "@/store/useContact"

export default function Home() {
  const [selectedContact, setSelectedContact] = useState<Person>()

  return (
    <div className="flex h-screen bg-zinc-900">
      <PeopleList onSelectContact={setSelectedContact} />
      <ChatSection selectedContact={selectedContact} />
    </div>
  )
}

