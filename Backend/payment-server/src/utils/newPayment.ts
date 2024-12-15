import { prisma } from "../db";
import { PaymentType,PaymentStatus } from "@prisma/client";
interface newPaymentRequest {
       bankReferenceId: string;
       PaymentType: PaymentType;
       idempotencyKey: string;
        userId: string;
        amount: number;
        bankResponseStatus: PaymentStatus;
}
export async function StoreNewPaymentRequest(event: newPaymentRequest){
    try {
        const { bankReferenceId,PaymentType,idempotencyKey,userId,amount,bankResponseStatus } = event;
        const newPayment =  await prisma.paymentRequest.create({
            data: {
                 userId: userId,
                 amount: amount,
                 idempotencyKey: idempotencyKey,
                 bankReferenceId: bankReferenceId,
                 PaymentStatus: bankResponseStatus,
                 PaymentType: PaymentType,
            }
        });
        console.log(`New Payment Entry created in Database with id: ${newPayment.id}`);
        return newPayment;
    } catch (error) {
        console.error("Error while creating a new Payment Entry in Database:",error);
        throw new Error("Failed to create a new payment in database");
    }

}