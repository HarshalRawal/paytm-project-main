import { create } from 'zustand';

export interface Transaction {
  id: string;
  amount: number;
  status: 'COMPLETED' | 'FAILED' | 'PROCESSING';
  transactionType: 'TOP_UP' | 'WITHDRAWAL' | 'P2P_TRANSFER';
  from?: string;
  to?: string;
  walletId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginationState {
  transactions: Transaction[];
  cursor: string | null;
  loading: boolean;
  hasNextPage: boolean;
  setTransactions: (transactions: Transaction[] | ((prevTransactions: Transaction[]) => Transaction[])) => void;
  setLoading: (loading: boolean) => void;
  setCursor: (cursor: string | null) => void;
  setHasNextPage: (hasNextPage: boolean) => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  transactions: [],
  cursor: null,
  loading: false,
  hasNextPage: false,
  setTransactions: (transactions) => set((state) => ({ 
    transactions: typeof transactions === 'function' ? transactions(state.transactions) : transactions 
  })),
  setLoading: (loading) => set({ loading }),
  setCursor: (cursor) => set({ cursor }),
  setHasNextPage: (hasNextPage) => set({ hasNextPage }),
}));

