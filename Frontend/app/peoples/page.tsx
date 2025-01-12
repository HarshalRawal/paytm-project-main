'use client'

import { useState } from 'react'
import { PeopleList } from "@/components/peoples/people-list"
import { ChatSection } from "@/components/peoples/chat-section"
import { Person } from "@/store/useContact"
import { useRouter } from 'next/navigation'

export default function Home() {
  const router =  useRouter();
  const [selectedContact, setSelectedContact] = useState<Person>()
  try{
    const token = localStorage.getItem("authToken");
        console.log(token);

        if(!token){
          alert("Sign in to view peopleList");
          router.push('/signin')
          return;
        }
    }catch(error){

  }
  return (
    <div className="flex h-screen bg-zinc-900">
      <PeopleList onSelectContact={setSelectedContact} />
      <ChatSection selectedContact={selectedContact} />
    </div>
  )
}

