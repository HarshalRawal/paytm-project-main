import axios from 'axios';
import {create} from 'zustand';

type BalanceState = {
  balance: number | null;
  loading: boolean;
  error: string | null;
  fetchBalance: (userId: string) => Promise<void>;
  setBalance: (newBalance: number) => void;
};

export const useBalance = create<BalanceState>((set) => ({
  balance: null,
  loading: false,
  error: null,

  // Fetch balance from backend
  fetchBalance: async (userId: string) => {
    if (!userId) {
      console.error('User ID is required to fetch balance.');
      set({ error: 'Invalid user ID', loading: false });
      return;
    }

    set({ loading: true });
    try {
      const response = await axios.post<{ balance: number }>(
        'http://localhost:8080/api-gateway/getBalance/',
        { userId }
      );

      const { balance } = response.data; // Ensure backend sends `{ balance: <number> }`
      set({ balance, loading: false, error: null });
    } catch (error) {
      console.error('Error fetching balance:', error);
      set({
        loading: false,
        error: 'Failed to fetch balance. Please try again later.',
      });
    }
  },

  // Set balance directly
  setBalance: (newBalance: number) => set({ balance: newBalance }),
}));
