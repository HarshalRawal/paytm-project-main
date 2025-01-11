import { createClient, RedisClientType } from "redis";
const BALANCE_CACHE_TTL = 3600;
export let redisClient: RedisClientType;
export let redisSubscriber: RedisClientType;
export async function initRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL||"redis://localhost:6379"
    });
    redisClient.on("error", (err) => {
      console.error("Error in Redis Client: ", err);
    });
    await redisClient.connect();
    console.log("Redis Client Connected");
  }
  return redisClient;
}

export const getChatKey = (userId1: string, userId2: string): string => {
    const [sortedUserId1, sortedUserId2] = [userId1, userId2]
      .map((id) => id.trim().toLowerCase()) // Trim and lowercase the IDs
      .sort();
    return `chat_map:${sortedUserId1}:${sortedUserId2}`;
  };
  
  // Function to check if a chat ID exists in Redis
  export const checkChatIdExists = async (senderId: string, receiverId: string): Promise<string | null> => {
    const chatKey = getChatKey(senderId, receiverId);
    const client = await initRedisClient(); // Initialize Redis client
    try {
      const chatId = await client.hGet(chatKey, "chat_id");
      if(!chatId){
        console.log(`CACHE MISS: Chat ID not found for users ${senderId} and ${receiverId}`);
      } // Use `hGet` to fetch from hash
      else{
        console.log(`CACHE HIT: Chat ID found for users ${senderId} and ${receiverId}`);
      }
      return chatId || null; // Return null if no chatId exists
    } catch (error) {
      console.error(`Error checking chat ID for users ${senderId} and ${receiverId}:`, error);
      throw error;
    }
  };
  
  // Function to store a chat ID in Redis with a TTL
  export const storeChatId = async (senderId: string, receiverId: string, chatId: string): Promise<void> => {
    const chatKey = getChatKey(senderId, receiverId);
    const client = await initRedisClient(); // Initialize Redis client
    try {
      await client.hSet(chatKey, "chat_id", chatId); // Store in hash field `chat_id`
      await client.expire(chatKey,3600); // Set a TTL of 1 hour (3600 seconds)
      console.log(`Stored chatId: ${chatId} for users ${senderId} and ${receiverId}`);
    } catch (error) {
      console.error(`Error storing chatId: ${chatId} for users ${senderId} and ${receiverId}:`, error);
      throw error;
    }
  };