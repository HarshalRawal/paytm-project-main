import { produceToApiGateway } from "../consumer/consume";
import { checkChatIdExists,storeChatId } from "../redis/client";
import { getChatId,storeNewChats } from "./Chat";

interface Message {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
}

export const processMessages = async (message:Message) => {
    try {
      // Validate message
      if (!message || typeof message !== "object") {
        throw new Error("Invalid message format");
      }
  
      const { senderId, receiverId, timestamp, content } = message;
  
      if (!senderId || !receiverId || !content || !timestamp) {
        throw new Error(
          `Missing required fields: senderId=${senderId}, receiverId=${receiverId}, timestamp=${timestamp}, content=${content}`
        );
      }
  
      // Check and fetch chatId
      let chatId = await checkChatIdExists(senderId, receiverId);
      if (!chatId) {
        chatId = (await getChatId(senderId, receiverId)) ?? null;
      }
  
      if (chatId) {
        await storeChatId(senderId, receiverId, chatId);
  
        const newMessage = await storeNewChats(
          senderId,
          receiverId,
          chatId,
          timestamp,
          content
        );
  
        await produceToApiGateway(newMessage);
        console.log(`New message stored for chatId: ${chatId}`);
      } else {
        console.error("Chat ID could not be determined for the message:", message);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };
  