import { produceToApiGateway } from "../consumer/consume";
import { checkChatIdExists, storeChatId } from "../redis/client";
import { getChatId, storeNewChats } from "./Chat";

// Define the Message interface
interface Message {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
}

// Main function to process messages
export const processMessages = async (message: Message) => {
    try {
        // Debug: Log the received message

        // Validate message
        if (!message || typeof message !== "object") {
            throw new Error("Invalid message format: not an object");
        }

        const { senderId, receiverId, content, timestamp } = message;

        // Check for missing fields
        if (!senderId || !receiverId || !content || !timestamp) {
            throw new Error(
                `Missing required fields: senderId=${senderId}, receiverId=${receiverId}, timestamp=${timestamp}, content=${content}`
            );
        }

        // Check if chat ID exists in Redis
        let chatId = await checkChatIdExists(senderId, receiverId);
        if (!chatId) {
            // Fetch chat ID if not found in Redis
            chatId = (await getChatId(senderId, receiverId)) ?? null;
        }

        if (chatId) {
            // Store chat ID in Redis for future lookups
            await storeChatId(senderId, receiverId, chatId);

            // Store the new message
            const newMessage = await storeNewChats(
                senderId,
                receiverId,
                chatId,
                timestamp,
                content
            );
            console.log(`New message stored for chatId: ${chatId}`);
            if(newMessage){
                const kafkaMessage = {
                    senderId:newMessage.senderId,
                    receiverId:newMessage.receiverId,
                    content:newMessage?.content || "",
                    timestamp:newMessage.timestamp.toString(),
                  }
                await produceToApiGateway(kafkaMessage);
                }
        } else {
            // Handle case where chat ID could not be determined
            console.error("Chat ID could not be determined for the message:", message);
        }
    } catch (error) {
        // Handle errors with proper type checking
        if (error instanceof Error) {
            console.error("Error processing message:", {
                rawMessage: JSON.stringify(message),
                error: error.message,
                stack: error.stack,
            });
        } else {
            // Log unknown error types
            console.error("Unexpected error:", {
                rawMessage: JSON.stringify(message),
                error,
            });
        }
    }
};
