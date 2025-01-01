import axios from 'axios'
export interface Person {
  id: string;
  name: string;
  username: string | null;
  avatar: string;
}

export async function fetchContacts(): Promise<Person[]> {
  const userId = '3291280e-5400-490d-8865-49f6591c249c'
  try {
    const response = await axios.get(`http://localhost:8080/api-gateway/getContact/`,{
     params:{userId:userId}
    })
    console.log(`fetchContacts response: ${response.data}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
    return []
  }
}
// We'll keep this for initial loading or fallback
export const initialPeople: Person[] = [
  { id: '1', name: 'Loading...', username: null, avatar: '/placeholder.svg?height=40&width=40&text=...' },
]

