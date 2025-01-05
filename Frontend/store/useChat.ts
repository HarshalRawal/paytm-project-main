import {create} from 'zustand';
export interface ChatStore {
    chats: Chat[]; // List of chats
    messages: Record<string, Message[]>; // Messages mapped by chatId
    selectedChatId: string | null; // Currently selected chat
  
    // Actions
    setChats: (chats: Chat[]) => void;
    addChat: (chat: Chat) => void;
    updateLastMessage: (chatId: string, lastMessage: string) => void;
    setMessages: (chatId: string, messages: Message[]) => void;
    addMessage: (chatId: string, message: Message) => void;
    selectChat: (chatId: string | null) => void;
  }
export interface Message {
    id: string; // Unique identifier for the message
    chatId: string; // ID of the chat this message belongs to
    senderId: string; // User ID of the sender
    receiverId: string; // User ID of the receiver
    content?: string; // Message content (optional for transaction messages)
    type: MessageType; // Message type (e.g., TEXT, TRANSACTION)
    textStatus?: MessageStatus; // Delivery status for text messages
    timestamp: string; // ISO timestamp of when the message was sent
    transactionId?: string; // Reference to the transaction (optional)
    attachmentUrl?: string; // URL for attachments (optional)
  }
  
  // Chat Type
  export interface Chat {
    id: string; // Unique identifier for the chat
    participant1Id: string; // ID of the first participant
    participant2Id: string; // ID of the second participant
    lastMessage?: string; // Content of the last message
    status: ChatStatus; // Status of the chat
    updatedAt: string; // ISO timestamp of the last update
    createdAt: string; // ISO timestamp when the chat was created
  }
  
  // Enums for Message and Chat
  export enum MessageType {
    TEXT = 'TEXT',
    TRANSACTION = 'TRANSACTION',
  }
  
  export enum MessageStatus {
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    READ = 'READ',
  }
  
  export enum ChatStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED',
  }
  
  // Zustand Store Types
  export interface ChatStore {
    chats: Chat[]; // List of chats
    messages: Record<string, Message[]>; // Messages mapped by chatId
    selectedChatId: string | null; // Currently selected chat
    // Actions
    setChats: (chats: Chat[]) => void;
    addChat: (chat: Chat) => void;
    updateLastMessage: (chatId: string, lastMessage: string) => void;
    setMessages: (chatId: string, messages: Message[]) => void;
    addMessage: (chatId: string, message: Message) => void;
    selectChat: (chatId: string | null) => void;
    fetchChats: (participant1Id:string,participant2Id:string)=> Promise<void>
  }
export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  messages: {},
  selectedChatId: null,

  setChats: (chats: Chat[]) => set({ chats }),
  addChat: (chat: Chat) =>
    set((state) => ({ chats: [...state.chats, chat] })),
  updateLastMessage: (chatId: string, lastMessage: string) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, lastMessage } : chat
      ),
    })),
  setMessages: (chatId: string, messages: Message[]) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages },
    })),
  addMessage: (chatId: string, message: Message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),
  selectChat: (chatId: string | null) => set({ selectedChatId: chatId }),
  fetchChats: async(participant1Id:string,participant2Id:string)=>{
    try {
        
    } catch (error) {
        console.error(`Error fetching chat for participate users: ${participant1Id} and ${participant2Id}. ERROR:${error}`);
    }
  }
}));
