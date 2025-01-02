import axios from 'axios';
import { Request,Response } from 'express';
import bcrypt from 'bcrypt';
import { getHashedPinInRedis,storeHashedPinInRedis } from '../redis/redisClient';
export const fetchTransactionsFromWalletServer = async (walletId: string, cursor: string | null, limit: number) => {
  try {
    const response = await axios.get('http://localhost:8086/transactions', {
      params: { walletId, cursor, limit }
    });

    // Check if the response data is a string and needs to be parsed
    if (typeof response.data === 'string') {
      return JSON.parse(response.data);  // Parse the stringified JSON response
    }

    // Return data as is if it's already an object
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions from wallet server:", error);
    throw new Error("Error fetching transactions from wallet server");
  }
};
async function validatePin(pin: string, userId: string): Promise<boolean> {
  try {
    // First, try getting the hashed PIN from Redis
    const hashedPin = await getHashedPinInRedis(userId);
    
    if (hashedPin == null) {
      // If not found in Redis, fetch from external API
      console.log('cached pin not found in redis');
      console.log(`Fetching hashed PIN from API for walletId: ${userId}`);
      const response = await axios.get('http://localhost:6001/getHashedPin', {
        params: { userId }
      });
      
      // Assuming the API returns the hashedPin
      const { hashedPin: apiHashedPin } = response.data;
      console.log(apiHashedPin.toString());
       console.log(`Fetched hashed PIN from API for walletId: ${userId}`);
      // Store the hashed PIN in Redis for future validation
      await storeHashedPinInRedis(userId, apiHashedPin);

      // Compare the provided PIN with the hashed one fetched from the API
      console.log('comparing pin with apiHashedPin');
      const match = await bcrypt.compare(pin.toString(), apiHashedPin.toString());
      return match;
    } else {
      console.log('cached pin found in redis');
      console.log(hashedPin.toString());
      // If hashedPin exists in Redis, directly compare the PIN
      console.log('comparing pin with cached hashedPin ..');
      console.log(`hashedPin: ${hashedPin}`);
      console.log(`pin: ${pin}`);
      const match = await bcrypt.compare(pin.toString(), hashedPin.toString());
      console.log(match);
      return match;
    }
  } catch (error) {
    console.error('Error validating pin:', error);
    return false;
  }
}
export async function p2pTransactionHandler(req: Request, res: Response) {
  try {
    const { senderId, receiverId, amount, pin } = req.body;

    console.log(`Processing P2P transaction from ${senderId} to ${receiverId} for amount ${amount}`);

    // Check for missing fields in the request body
    if (!senderId || !receiverId || amount == null || pin == null) {
      res.status(400).json({ error: 'senderWalletId, receiverWalletId, amount, and pin are required' });
      return;
    }

    // Validate the PIN for the sender
    const isPinValid = await validatePin(pin, senderId);
    console.log(`isPinValid: ${isPinValid}`);
    if (isPinValid===false) {
      console.log(`Invalid PIN for walletId: ${senderId}`);
      res.json({ error: 'Invalid PIN' });
      return;
    }
     console.log(`PIN validated successfully for walletId: ${senderId}`);
    // Respond back to frontend that the transaction is in progress
    res.status(202).json({ message: 'P2P transaction in progress' });

    // Send the P2P transaction request to the wallet service asynchronously
    console.log('Sending P2P transaction request to wallet service');
    try {
      const response = await axios.post('http://localhost:8086/p2pTransaction', {
        senderId,
        receiverId,
        amount,
      });

      console.log(`Transaction response: ${JSON.stringify(response.data)}`);

      // You can perform additional handling for the response from the wallet service here (e.g., logging, storing transaction records, etc.)
      // Optionally, you can also notify the frontend of the transaction status if needed in another way.
    } catch (error) {
      console.error(`Error sending P2P transaction to wallet service: ${error}`);
      // Optionally, handle the error gracefully if the wallet service fails (e.g., updating the frontend or retrying the request).
    }
  } catch (error) {
    console.error(`Error processing transaction: ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
}

