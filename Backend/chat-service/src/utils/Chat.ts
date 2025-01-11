import { prisma } from "../db";


export const getChatId = async(senderId: string, receiverId: string):Promise<string | undefined>=> {
    let [participant1Id, participant2Id] = [senderId as string, receiverId as string]
    .map(id => id.trim().toLowerCase())  // Trim and lowercase the ids
    .sort();
    console.log(`Request received: senderId = ${senderId}, receiverId = ${receiverId}`);
    console.log(`Sorted: participant1Id = ${participant1Id}, participant2Id = ${participant2Id}`);
    try {
        // Check if chat exists for both participant orders (sender -> receiver and receiver -> sender)
        let chat = await prisma.chat.findFirst({
          where: {
            participant1Id,
            participant2Id
          },
          select: {
            id: true,
          },
        });
        console.log(`Chat found: ${chat ? chat.id : 'No chat found'}`);
        // If no chat exists, create one
        if (!chat) {
          console.log(`Creating new chat for participants: ${participant1Id}, ${participant2Id}`);
          chat = await prisma.chat.create({
            data: {
              participant1Id,
              participant2Id,
            },
            select: {
              id: true,
            },
          });
          return chat.id;
        }
        return chat.id;
      } catch (error) {
        console.error(`Error fetching or creating chat for users: ${participant1Id} and ${participant2Id}`, error);
      }
}
export const storeNewChats = async(senderId: string, receiverId: string, chatId: string,timestamp:string,content?:string)=>{
   try {
    const newMessage = await prisma.message.create({
      data:{
        chatId:chatId,
        content:content,
        senderId:senderId,
        receiverId:receiverId,
        type:"TEXT",
        timestamp:new Date(timestamp)
      }
    })
    return newMessage;
   } catch (error) {
    console.error(`Error storing new chat for users: ${senderId} and ${receiverId}`, error);
   }
}