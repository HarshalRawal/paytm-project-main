import { Payload } from "../consumer/consumer";
import { prisma } from "../db";
// export interface Payload {
//     transactionType: PaymentType;
//     bankReferenceId: string;
//     userId: string;
//     status: PaymentStatus;
//     amount: number;
// }
// model PaymentRequest {
//     id             String      @id @default(uuid())  
//     amount         Decimal
//     PaymentStatus  PaymentStatus
//     userId         String
//     idempotencyKey String      @unique
//     bankReferenceId String     @unique
//     PaymentType    PaymentType
//     createdAt      DateTime    @default(now())
//     updatedAt      DateTime    @updatedAt
//   }
export async function updatePaymentTable({transactionType,bankReferenceId,userId,status,amount}: Payload) {
   
    try {
        await prisma.paymentRequest.update({
            where: { bankReferenceId },
            data:{PaymentStatus:status}
        })
    } catch (error) {
        console.error("Error updating payment table",error);
        throw new Error("Error updating payment table");
    }
    // Add code to update payment table
}