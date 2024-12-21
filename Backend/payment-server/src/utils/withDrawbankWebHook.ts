import { prisma } from "../db";
import { PaymentType,PaymentStatus } from "@prisma/client";

interface newWithdrawRequest {
       bankReferenceId: string;
       PaymentType: PaymentType;
       idempotencyKey: string;
        userId: string;
        amount: number;
        bankResponseStatus: PaymentStatus;
}

export async function sendWithDrawToBankWebhook(event : newWithdrawRequest){
    const { bankReferenceId,PaymentType,idempotencyKey,userId,amount,bankResponseStatus } = event;
    if(!bankReferenceId || !PaymentType || !userId || !amount || !bankResponseStatus){
        console.log("Missing required fields in withdraw")
        return ;
    }
    const payload = {
        transactionType: PaymentType,
        bankReferenceId: bankReferenceId,
        userId,
        status : bankResponseStatus,
        amount,
    };

    const payloadString = JSON.stringify(payload);

    console.log("Payload String:", payloadString);

    try {
        // Send the webhook notification to the bank-webhook-handler
    
        const respone  = await axios.post("http://localhost:5002/api/BankWebhook", JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json', // Set the content type to application/json
               
            },
        });
        console.log('Transaction(withdraw) processed and webhook sent successfully');
        // res.status(200).json({ message: 'Transaction processed and webhook sent successfully' });
        return;
    } catch (error) {
        console.error('Error sending webhook:', error);
        // res.status(500).json({ error: 'Failed to send webhook notification' });
        return;
    }
}