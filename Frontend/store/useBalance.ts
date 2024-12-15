import { create } from 'zustand';
import axios from 'axios';

interface BalanceState {
  balance: number | null;
  loading: boolean;
  error: string | null;
  fetchBalance: (userId: string) => Promise<void>;
  setBalance: (newBalance: number) => void; // Correctly typed
}

export const useBalance = create<BalanceState>((set) => ({
  balance: null,
  loading: false,
  error: null,
  // Fetch balance from backend
  fetchBalance: async (userId: string) => {
    set({ loading: true });
    try {
      const response = await axios.post<number>('http://localhost:8080/api-gateway/getBalance/', {
        userId,
      });
      const data = response.data;
      set({ balance: data, loading: false, error: null });
    } catch (error) {
      console.error('Error fetching balance:', error);
      set({ loading: false, error: 'Error fetching balance' });
    }
  },
  // Set balance directly
  setBalance: (newBalance: number) => set({ balance: newBalance }),
}));
