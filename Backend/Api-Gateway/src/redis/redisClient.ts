import { Response } from "express";
import { createClient,RedisClientType } from "redis";

export let redisClient: RedisClientType;

export async function initRedisClient():Promise<RedisClientType>{
   if(!redisClient){
     redisClient = createClient({
        url: process.env.REDIS_URL
     });
     redisClient.on("error",(err)=>{
        console.error("Error in Redis Client: ",err);
     })
     await redisClient.connect();
     console.log("Redis Client Connected");
   }
   return redisClient;
}
 export async function storeIdempotencyKey(idempotencyKey:string):Promise<void>{
    const client = await initRedisClient();
    const interiumResponse = {
        status: "processing",
        message: "Request is being processed",
        createdAt: new Date().toISOString()
    }
    await client.hSet(idempotencyKey,{
        status:interiumResponse.status,
        response: JSON.stringify(interiumResponse),
        createdAt: interiumResponse.createdAt
    });
    await client.expire(idempotencyKey, 60);
} 

 export async function getIdempotencyResponse(idempotencyKey:string):Promise<string|undefined>{
    const client = await initRedisClient();
    const response = await client.hGet(idempotencyKey,"response");
        if(response){
        return JSON.parse(response);
      }

}
export async function updateIdempotencyKey(idempotencyKey: string, res: Response): Promise<void> {
    try {
      // Initialize Redis client
      const client = await initRedisClient();
  
      // Serialize the response into a JSON string
      const serializedResponse = JSON.stringify({
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        body: res.json,
      });
      await client.hSet(idempotencyKey,{
        status:res.statusMessage,
        interiumResponse: serializedResponse,
        updatedAt: new Date().toISOString() 
      });
      await  client.expire(idempotencyKey,1000);
  
      console.log(`Idempotency key '${idempotencyKey}' successfully updated in Redis.`);
    } catch (error) {
      console.error('Error updating idempotency key in Redis:', error);
      throw new Error('Failed to update idempotency key in Redis');
}
}
    
export async function idempotencyKeyExists(idempotencyKey:string):Promise<boolean>{
    const client = await initRedisClient();
    return await client.exists(idempotencyKey) === 1;
 }  

 export async function checkTransactionInCache(cacheKey: string): Promise<string | null> {
  try {
    const client = await initRedisClient();
    const cachedData = await client.get(cacheKey);;
    if (cachedData) {
      console.log("Cache hit for key:", cacheKey);
      const transactions = JSON.parse(cachedData);
      return transactions;
    } else {
      console.log("Cache miss for key:", cacheKey);
      return null;
    }
  } catch (error) {
    console.error("Error checking cache:", error);
    return null;
  }
}


export async function storeTransactionInCache(cacheKey: string, data: any, ttl: number = 3600): Promise<void> {
  try {
    const client = await initRedisClient();
    await client.setEx(cacheKey, ttl, JSON.stringify(data));
    console.log("Cache set for key:", cacheKey);
  } catch (error) {
    console.error("Error storing cache:", error);
  }
}

// export async function updateTransactionInCache(cacheKey: string, newTransaction: any): Promise<void|any[]> {
//   try {
//     const client = await initRedisClient();

//     // Fetch the existing cache data
//     const cachedData = await client.get(cacheKey);
//     let transactions: any[] = [];
//     // Parse the cached data if it exists
//     if (cachedData) {
//       try {
//         const parsedData = JSON.parse(cachedData);
//         if(parsedData.transactions){
//          transactions = parsedData.transactions;
//          console.log("transactions",transactions);
//         }
//         if (!Array.isArray(transactions)) {
//           throw new Error(`Cached data for key "${cacheKey}" is not an array.`);
//         }
//       } catch (parseError) {
//         console.error(`Error parsing cached data for key "${cacheKey}":`, parseError);
//         transactions = []; // Reset to an empty array if parsing fails
//       }
//     }
//     const 
//     // Add the new transaction to the beginning of the array
//     transactions.unshift(newTransaction);

//     // Trim the array to keep only the first 10 transactions
//     //transactions = transactions.slice(0, 10);
//     // Update the cache with the modified data and set expiration time
//     await client.setEx(cacheKey, 3600, JSON.stringify({ transactions,nextCursor }));
//     console.log(`Cache updated for key: "${cacheKey}" with new transaction.`);
//     return transactions;
//   } catch (error) {
//     console.error(`Error updating cache for key "${cacheKey}":`, error);
//   }
// }

export async function updateTransactionInCache(userId:string, newTransaction:any) {
  try {
    const client = await initRedisClient();

    // Get all related keys for the user
    const relatedKeys = await client.keys(`transactions:${userId}:*`);
    relatedKeys.sort(); // Sort keys to process in order, e.g., page:1 -> page:2

    let carryOverTransaction = newTransaction; // Start with the new transaction

    for (const cacheKey of relatedKeys) {
      // Fetch existing transactions for the current key
      const cachedData = await client.get(cacheKey);
      let transactions = [];
      let parsedData = [];
      let nextCursor = null;
      if (cachedData) {
        try {
          parsedData = JSON.parse(cachedData);
          if (parsedData.transactions) {
            transactions = parsedData.transactions;
          }
          if (!Array.isArray(transactions)) {
            console.warn(`Cached data for key "${cacheKey}" is not an array. Resetting to empty array.`);
            transactions = [];
          }
        } catch (parseError) {
          console.error(`Error parsing cached data for key "${cacheKey}":`, parseError);
          transactions = [];
        }
      }

      // Add the carry-over transaction to the start of this array
      if (carryOverTransaction) {
        transactions.unshift(carryOverTransaction);
      }

      // Keep only the first 10 transactions, and move the overflow to carry-over
      if (transactions.length > 10) {
        carryOverTransaction = transactions.pop(); // Move the last transaction to carry-over
      } else {
        carryOverTransaction = null; // No more carry-over needed
      }

      nextCursor = transactions[9].createdAt || null;
      console.log("nextCursor",nextCursor);
      await client.setEx(cacheKey, 3600, JSON.stringify({ transactions, nextCursor }));
      console.log(`Cache updated for key: "${cacheKey}"`);
    }

    // If there's still a carry-over transaction, log it
    if (carryOverTransaction) {
      console.warn(`Carry-over transaction could not be stored:`, carryOverTransaction);
    }
  } catch (error) {
    console.error(`Error updating cache for userId "${userId}":`, error);
  }
}


