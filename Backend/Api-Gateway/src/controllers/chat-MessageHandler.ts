import { checkChatIdExists,storeChatId,addMessageToRedis,getMessagesFormRedis} from "../redis/redisChat";
import { getConnection } from "..";
import axios from "axios";
export interface Message {
    event:"string",
    data: any
}


const sendMessageToReceiver = async (receiverId: string, message: object) => {
    const receiverConnection = getConnection(receiverId);

    if (receiverConnection) {
        try {
            const serializedMessage = JSON.stringify(message);
            receiverConnection.send(serializedMessage); // Send the message to the connected WebSocket
            console.log(`Message sent to receiver ${receiverId}`);
        } catch (error) {
            console.error(`Error sending message to receiver ${receiverId}`, error);
        }
    } else {
        console.log(`Receiver ${receiverId} is not connected. Message stored in Redis.`);
    }
};

const fetchChatId = async (senderId: string, receiverId: string) => {
    try {
      const response = await axios.get("http://localhost:2211/fetchChatId", {
        params: { senderId, receiverId }
      });
  
      const { chatId } = response.data;
      console.log(`Fetched chatId: ${chatId} for users ${senderId} and ${receiverId}`);
      return chatId;
    } catch (error) {
      console.error(`Error fetching chatId for users ${senderId} and ${receiverId}`, error);
      throw error;
    }
  }
  

export const handleMessage = async(message:Message)=>{
    const {event,data} = message
    const senderId = data.senderId;
    const receiverId = data.receiverId;
    console.log(senderId,receiverId);
    try {
        let chat_Id = await checkChatIdExists(senderId,receiverId);
        if(chat_Id){
            console.log(` CACHE HIT!!! => Chat Id found for users ${senderId} and ${receiverId}`);
            await addMessageToRedis(chat_Id,data);

        }
        else{
            console.log(`CACHE MISS!!!`);
            console.log(` Getting Chat Id for users ${senderId} and ${receiverId}`);
            const chatId = await fetchChatId(senderId,receiverId);
            await storeChatId(senderId,receiverId,chatId);
            addMessageToRedis(chatId,data);
        }
        await sendMessageToReceiver(receiverId,data);
        return;
    } catch (error) {
       console.log("Error in handleMessage",error);
    }
}