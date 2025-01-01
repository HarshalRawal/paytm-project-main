export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
}

export const chats: Chat[] = [
  {
    id: '1',
    participants: ['user123', 'contact1'],
    messages: [
      {
        id: 'm1',
        content: 'Hey, how are you?',
        senderId: 'contact1',
        timestamp: '2024-01-01T09:00:00Z',
        status: 'read'
      },
      {
        id: 'm2',
        content: 'I\'m good, thanks! How about you?',
        senderId: 'user123',
        timestamp: '2024-01-01T09:01:00Z',
        status: 'read'
      },
      {
        id: 'm3',
        content: 'Working on any interesting projects?',
        senderId: 'contact1',
        timestamp: '2024-01-01T09:02:00Z',
        status: 'read'
      }
    ]
  },
  {
    id: '2',
    participants: ['user123', 'contact2'],
    messages: [
      {
        id: 'm4',
        content: 'Did you check the latest updates?',
        senderId: 'contact2',
        timestamp: '2024-01-01T10:00:00Z',
        status: 'read'
      },
      {
        id: 'm5',
        content: 'Yes, looks great! Let\'s discuss tomorrow.',
        senderId: 'user123',
        timestamp: '2024-01-01T10:01:00Z',
        status: 'delivered'
      }
    ]
  }
]

export function getChatForContact(contactId: string): Chat | undefined {
  return chats.find(chat => 
    chat.participants.includes(contactId) && 
    chat.participants.includes('user123')
  )
}

