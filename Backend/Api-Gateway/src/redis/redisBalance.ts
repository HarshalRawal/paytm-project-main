import { initRedisClient } from "./redisClient";

const BALANCE_CACHE_TTL = 3600; // Cache Time-To-Live in seconds

// Helper function to generate cache keys
function generateCacheKey(userId: string): string {
  return `balance:${userId}`;
}

// Check balance in Redis
export async function checkBalanceInRedis(userId: string): Promise<number | null> {
  try {
    const client = await initRedisClient();
    const cacheKey = generateCacheKey(userId);
    const cachedBalance = await client.get(cacheKey);
    return cachedBalance ? parseFloat(cachedBalance) : null;
  } catch (error) {
    console.error("Error checking balance in Redis:", error);
    return null;
  }
}

// Store balance in Redis
export async function storeBalanceInRedis(userId: string, balance: number): Promise<void> {
  try {
    const client = await initRedisClient();
    const cacheKey = generateCacheKey(userId);
    await client.setEx(cacheKey, BALANCE_CACHE_TTL, balance.toString());
  } catch (error) {
    console.error(`Error storing balance in Redis for userId: ${userId}`, error);
  }
}

// Update balance in Redis
export async function updateBalanceInRedis(userId: string, newBalance: string): Promise<void> {
  try {
    const client = await initRedisClient();
    const cacheKey = generateCacheKey(userId);
    await client.setEx(cacheKey, BALANCE_CACHE_TTL, newBalance);
    console.log(`successfully updated the balance in cache for userId: ${userId}`);
  } catch (error) {
    console.error(`Error updating balance in Redis for userId: ${userId}`, error);
  }
}
