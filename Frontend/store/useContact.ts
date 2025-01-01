import axios from 'axios';
import { create } from 'zustand';

export interface Person {
  id: string;
  name: string;
  phone: string;
  username: string | null;
  avatar: string;
}

interface ContactState {
  contacts: Person[];
  setContacts: (contacts: Person[]) => void;
  fetchContacts: () => Promise<void>;
  addContactToStore: (newContact: Person) => void; // Method to add a contact
}

export const useContactsStore = create<ContactState>((set) => ({
  contacts: [], // Initially empty, will be populated by the API
  setContacts: (contacts) => set({ contacts }),

  fetchContacts: async () => {
    try {
      const userId = '3291280e-5400-490d-8865-49f6591c249c';
      const response = await axios.get('http://localhost:8080/api-gateway/getContact', {
        params: { userId },
      });

      console.log('Contacts fetched:', response.data);
      set({ contacts: response.data });
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      set({ contacts: [] }); // In case of error, set empty contacts
    }
  },

  addContactToStore: (newContact) => {
    set((state) => ({ contacts: [...state.contacts, newContact] }));
  },
}));
