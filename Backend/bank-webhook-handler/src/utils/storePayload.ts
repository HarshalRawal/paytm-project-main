import { prisma } from "../db";
export interface Payload {
    transactionType: eventType;
    bankReferenceId: string;
    userId: string;
    status: string;
    amount: number;
}

// model Outbox {
//     id   String   @id @default(uuid())
//     eventType  eventType
//     published Boolean
//     Payload  Json
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//   }
import { eventType } from "@prisma/client";
export const storePayload = async ({transactionType,bankReferenceId,userId,status,amount}:Payload) => {
      try {
        const newOutbox = await prisma.outbox.create({
            data:{
                eventType: transactionType,
                Payload :{
                    transactionType,
                    bankReferenceId,
                    userId,
                    status,
                    amount
                } 
            }
        })
        console.log(`Payload stored in outbox with id: ${newOutbox.id}`);
        return newOutbox;
      } catch (error) {
        console.error("Error storing payload in outbox:", error);
        throw new Error("Error storing payload in outbox");
      }
}