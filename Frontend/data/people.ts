export interface Person {
  id: string;
  name: string;
  avatar: string;
}

export const people: Person[] = [
  { id: '1', name: 'Alice Johnson', avatar: '/placeholder.svg?height=40&width=40&text=AJ' },
  { id: '2', name: 'Bob Smith', avatar: '/placeholder.svg?height=40&width=40&text=BS' },
  { id: '3', name: 'Charlie Brown', avatar: '/placeholder.svg?height=40&width=40&text=CB' },
  { id: '4', name: 'Diana Prince', avatar: '/placeholder.svg?height=40&width=40&text=DP' },
  { id: '5', name: 'Ethan Hunt', avatar: '/placeholder.svg?height=40&width=40&text=EH' },
];

