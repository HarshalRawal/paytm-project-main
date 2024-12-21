import { Transaction } from './Transaction'
import { Button } from "@/components/ui/button"
import { Transaction as TransactionType } from '@/store/usePaginationState'

export interface RecentTransactionsProps {
  transactions: TransactionType[];
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export function RecentTransactions({ 
  transactions, 
  loading, 
  hasNextPage,
  onLoadMore
}: RecentTransactionsProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">Recent Transactions</h2>
      <div className="max-h-[400px] overflow-y-auto">
        {transactions?.length === 0 && !loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No transactions found.</p>
        ) : (
          <div className="space-y-4">
            {transactions?.map((transaction) => (
              <Transaction key={transaction.id} {...transaction} />
            ))}
          </div>
        )}
      </div>
      {loading && (
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">Loading more transactions...</p>
      )}
      {hasNextPage && !loading && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

