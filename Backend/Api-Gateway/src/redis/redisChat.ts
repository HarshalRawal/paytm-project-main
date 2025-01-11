import { initRedisClient,initRedisSubscriber } from "./redisClient";

// Function to generate a consistent Redis key for chat
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
    const chatId = await client.hGet(chatKey, "chat_id"); // Use `hGet` to fetch from hash
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


export const addMessageToRedis = async (chatId: string, message: object) => {
    const client = await initRedisClient();
    const key = `chat:${chatId}:messages`;
    try {
        const serializedMessage = JSON.stringify(message); // Serialize the message
        await client.rPush(key, serializedMessage); // Push the serialized message to the Redis list
        await client.expire(key,60); // Optional: Set an expiry for the list
        console.log(`Message added to Redis for chatId: ${chatId}`);
    } catch (error) {
        console.error(`Error adding message to Redis for chatId: ${chatId}`, error);
        throw error;
    }
};


export const getMessagesFormRedis = async (chatId: string) => {
    const client = await initRedisClient();
    const key = `chat:${chatId}:messages`;
    return await client.lRange(key, 0, -1); // Retrieve all messages
};


const getExpiredChats = async () => {
  const client = await initRedisClient();
  const subscriber = await initRedisSubscriber();
  try {
    const eventChannel = "__keyevent@0__:expired";
    await subscriber.pSubscribe(eventChannel, async (message) => {
      console.log(`Key expired: ${message}`);
      if (message.startsWith('chat:') && message.endsWith(':messages')) {
        // Backup the expired messages to another list before they are deleted
        const backupKey = `chat:${message.split(":")[1]}:expired_messages`;
        console.log("message:",JSON.stringify(message));
        // Copy expired data to the backup list
        const expiredMessages = await client.lRange(message, 0, -1);
        console.log(`Expired messages = `, expiredMessages);
        // if (expiredMessages.length > 0) {
        //   await client.rPush(backupKey, ...expiredMessages);
        //   console.log(`Expired messages backed up to ${backupKey}`);
        // }

        // Attempt to access expired messages
        console.log(`Expired messages for chat ${message}:`, expiredMessages);
      }
    });

    console.log(`Subscribed to Redis key expiration events on channel: ${eventChannel}`);
  } catch (error) {
    console.log("Error getting expired chats from redis:", error);
  }
};





(async () => {
  await getExpiredChats();
})();
