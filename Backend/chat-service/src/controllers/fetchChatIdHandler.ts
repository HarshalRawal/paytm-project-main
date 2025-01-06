import { Request, Response } from "express";
import { prisma } from "../db";

export const fetchChatIdHandler = async (req: Request, res: Response): Promise<void> => {
  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) {
    res.status(400).json({ error: "senderId and receiverId are required." });
    return;
  }
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
    }

    // Respond with chat ID
    res.status(200).json({ chatId: chat.id });
    return;
  } catch (error) {
    console.error(`Error fetching or creating chat for users: ${participant1Id} and ${participant2Id}`, error);
    res.status(500).json({ error: "Internal Server Error." });
    return;
  }
};

// import { Request, Response } from "express";
// import { prisma } from "../db";

// export const fetchChatIdHandler = async (req: Request, res: Response): Promise<void> => {
//   // Trim spaces from the senderId and receiverId from the query parameters
//   const { senderId, receiverId } = req.query;

//   if (!senderId || !receiverId) {
//     res.status(400).json({ error: "senderId and receiverId are required." });
//     return;
//   }

//   // Trim spaces and ensure lower case for case-insensitive comparison
//   let [participant1Id, participant2Id] = [senderId as string, receiverId as string]
//     .map(id => id.trim().toLowerCase())  // Trim and lowercase the ids
//     .sort();

//   console.log(`Request received: senderId = ${senderId}, receiverId = ${receiverId}`);
//   console.log(`Sorted: participant1Id = ${participant1Id}, participant2Id = ${participant2Id}`);

//   try {
//     // Log the raw query being sent to the database
//     console.log(`Running SQL query to find chat between ${participant1Id} and ${participant2Id}`);

//     // Query to find the existing chat
//     const chat = await prisma.$queryRaw<{ id: string }[]>`
//       SELECT "id" FROM "Chat" 
//       WHERE 
//         ("participant1Id" = ${participant1Id} AND "participant2Id" = ${participant2Id}) 
//         OR 
//         ("participant1Id" = ${participant2Id} AND "participant2Id" = ${participant1Id});
//     `;

//     // Log the query result
//     console.log("Chat query result:", chat);

//     if (chat && chat.length > 0) {
//       console.log('Chat exists:', chat[0].id);
//       res.status(200).json({ chatId: chat[0].id });
//     } else {
//       console.log('No chat found. Creating new chat...');
//       const newChat = await prisma.chat.create({
//         data: {
//           participant1Id,
//           participant2Id,
//         },
//         select: {
//           id: true,
//         },
//       });
//       res.status(200).json({ chatId: newChat.id });
//     }

//     return;
//   } catch (error) {
//     console.error(`Error fetching or creating chat for users: ${participant1Id} and ${participant2Id}`, error);
//     res.status(500).json({ error: "Internal Server Error." });
//     return;
//   }
// };

