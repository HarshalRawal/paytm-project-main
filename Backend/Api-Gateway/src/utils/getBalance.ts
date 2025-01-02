import axios from 'axios';
import { Request,Response } from 'express';
import { checkBalanceInRedis, storeBalanceInRedis } from '../redis/redisBalance';
export async function getBalance(userId: string) {
  try {
    const response = await axios.post<number>(
      `http://localhost:8086/getBalance/`,{
        userId
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw new Error('Error getting balance');
  }
}

export async function getBalanceHanler(req:Request, res:Response) {
  try {
      const { userId } = req.body;

      if (!userId) {
          res.status(400).json({ error: 'userId is required' });
          return;
      }

      // Check balance in cache
      const cachedBalance = await checkBalanceInRedis(userId);
      if (cachedBalance !== null) {
          console.log(`Cache hit for userId: ${userId}`);
          res.status(200).json({ balance: cachedBalance });
          return;
      }

      // Fetch balance from source
      console.log(`Cache miss. Fetching balance for userId: ${userId}`);
      const balance = await getBalance(userId);

      // Store fetched balance in cache and respond
      await storeBalanceInRedis(userId, balance);
      res.status(200).json({ balance });
      return;

  } catch (error) {
      console.error('Error getting balance:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
  }
}

export const checkBalanceHandler = async (req:Request, res:Response) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || amount == null) {
      res.status(400).json({ error: 'userId and amount are required' });
      return;
    }

    // Check balance in cache
    const cachedBalance = await checkBalanceInRedis(userId);
    let balance;

    if (cachedBalance !== null) {
      console.log(`Cache hit for userId: ${userId}`);
      balance = cachedBalance;
    } else {
      // Fetch balance from source
      console.log(`Cache miss. Fetching balance for userId: ${userId}`);
      balance = await getBalance(userId);

      // Store fetched balance in cache
      await storeBalanceInRedis(userId, balance);
    }

    // Check if balance is sufficient
    if (balance >= amount) {
      res.status(200).json({ success: true, message: 'Balance is sufficient' });
    } else {
      console.log(`Insufficient balance. Available balance: ${balance}`);
      res.status(200).json({ success: false, message: 'Insufficient balance' });
    }
    return;
  } catch (error) {
    console.error('Error checking balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



