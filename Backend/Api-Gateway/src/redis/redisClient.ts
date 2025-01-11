import { Response } from "express";
import { createClient, RedisClientType } from "redis";
const BALANCE_CACHE_TTL = 3600;
export let redisClient: RedisClientType;
export let redisSubscriber: RedisClientType;
export async function initRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });
    redisClient.on("error", (err) => {
      console.error("Error in Redis Client: ", err);
    });
    await redisClient.connect();
    console.log("Redis Client Connected");
  }
  return redisClient;
}
export async function initRedisSubscriber(): Promise<RedisClientType> {
  if (!redisSubscriber) {
    redisSubscriber = createClient({
      url: process.env.REDIS_URL,
    });
    redisSubscriber.on("error", (err) => {
      console.error("Error in Redis Subscriber: ", err);
    });
    await redisSubscriber.connect();
    console.log("Redis Subscriber Connected");
  }
  return redisSubscriber;
}
export async function storeIdempotencyKey(idempotencyKey: string): Promise<void> {
  const client = await initRedisClient();
  const interiumResponse = {
    status: "processing",
    message: "Request is being processed",
    createdAt: new Date().toISOString()
  };
  await client.hSet(idempotencyKey, {
    status: interiumResponse.status,
    response: JSON.stringify(interiumResponse),
    createdAt: interiumResponse.createdAt
  });
  await client.expire(idempotencyKey, 60);
}

export async function getIdempotencyResponse(idempotencyKey: string): Promise<string | undefined> {
  const client = await initRedisClient();
  const response = await client.hGet(idempotencyKey, "response");
  if (response) {
    return JSON.parse(response);
  }
}

export async function updateIdempotencyKey(idempotencyKey: string, res: Response): Promise<void> {
  try {
    const client = await initRedisClient();
    const serializedResponse = JSON.stringify({
      statusCode: res.statusCode,
      headers: res.getHeaders(),
      body: res.json,
    });
    await client.hSet(idempotencyKey, {
      status: res.statusMessage,
      interiumResponse: serializedResponse,
      updatedAt: new Date().toISOString()
    });
    await client.expire(idempotencyKey, 1000);
    console.log(`Idempotency key '${idempotencyKey}' successfully updated in Redis.`);
  } catch (error) {
    console.error('Error updating idempotency key in Redis:', error);
    throw new Error('Failed to update idempotency key in Redis');
  }
}

export async function idempotencyKeyExists(idempotencyKey: string): Promise<boolean> {
  const client = await initRedisClient();
  return await client.exists(idempotencyKey) === 1;
}

export async function checkTransactionInCache(cacheKey: string): Promise<string | null> {
  try {
    const client = await initRedisClient();
    const cachedData = await client.get(cacheKey);
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

export async function updateTransactionInCache(cacheKey: string, newTransaction: any) {
  try {
    const client = await initRedisClient();
    const relatedKeys = await client.keys(cacheKey);
    console.log("relatedKeys", relatedKeys);

    if (relatedKeys.length === 0) {
      console.warn("No related keys found. Consider initializing cache.");
      await client.setEx(cacheKey, 3600, JSON.stringify({ transactions: [newTransaction], nextCursor: null }));
      return;
    }

    relatedKeys.sort();
    let carryOverTransaction = newTransaction;
    let cachedData;
    let transactions = [];
    let nextCursor = null;
    for (const cacheKey of relatedKeys) {
      cachedData = await client.get(cacheKey);
      try {
        const parsedData = JSON.parse(cachedData || "{}");
        transactions = parsedData.transactions || [];
        console.log("transactions", transactions);
      } catch (parseError) {
        console.error(`Error parsing cached data for key "${cacheKey}":`, parseError);
      }

      if (carryOverTransaction) transactions.unshift(carryOverTransaction);

      if (transactions.length > 10) {
        carryOverTransaction = transactions.pop();
      } else {
        carryOverTransaction = null;
      }
      nextCursor = transactions.length >= 10 ? transactions[9].createdAt : null;
      console.log("nextCursor", nextCursor);
      await client.setEx(cacheKey, 3600, JSON.stringify({ transactions: transactions, nextCursor: nextCursor }));
    }

    if (carryOverTransaction) {
      console.warn(`Carry-over transaction could not be stored:`, carryOverTransaction);
    }
    return { transactions, nextCursor };
  } catch (error) {
    console.error(`Error updating cache for with cache key "${cacheKey}":`, error);
  }
}

export async function getHashedPinInRedis(userId: string): Promise<string | null> {
  try {
    const client = await initRedisClient();
    const hashedPin = await client.get(userId);
    return hashedPin;
  } catch (error) {
    console.error("Error getting hash ed pin from Redis:", error);
    return null;
  }
}

export async function storeHashedPinInRedis(userId: string, hashedPin: string): Promise<void> {
  try {
    const client = await initRedisClient();
    console.log(`Storing hashed pin ${hashedPin.toString()} in Redis for userId: ${userId}`);
    await client.setEx(userId, BALANCE_CACHE_TTL, hashedPin.toString());
  } catch (error) {
    console.error("Error storing hashed pin in Redis:", error);
  }
}