import { Request, Response } from 'express';
import { checkTransactionInCache,storeTransactionInCache } from '../redis/redisClient'; // Assuming these functions are correct
import { fetchTransactionsFromWalletServer } from '../utils/getTransaction';

export async function handleTransactionRequest(req: Request, res: Response): Promise<void> {
  console.log('Received request for transactions');
  const { walletId, cursor, limit = 10 } = req.query;
  const cacheKey = `transactions:${walletId}:${cursor || 'first'}:${limit}`;

  try {
    // Step 1: Check cache for data
    const cachedData = await checkTransactionInCache(cacheKey);
    if (cachedData) {
      console.log('Cache hit:', cacheKey);
      res.json(cachedData); // Return cached data if available
      return;
    }

    console.log("Cache miss:", cacheKey);

    // Step 2: Fetch data from wallet server if cache miss
    const transactionsData = await fetchTransactionsFromWalletServer(walletId as string, cursor as string | null, Number(limit));

    // Ensure the response is in the correct format (JSON object)
    if (!transactionsData || !transactionsData.transactions) {
      throw new Error('Invalid data structure from wallet server');
    }

    // Step 3: Store the response in the cache (ensure it's an object, not stringified)
    await storeTransactionInCache(cacheKey, transactionsData);

    // Step 4: Send the data back to the client
    res.json(transactionsData);

  } catch (error) {
    console.error('Error handling transaction request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
