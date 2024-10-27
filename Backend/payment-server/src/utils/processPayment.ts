import { sendTokenToGateway } from "./sendToken";
import axios from "axios";
import { StoreNewPaymentRequest } from "./newPayment";
import { PaymentStatus, PaymentType } from "@prisma/client";
interface newPaymentRequest {
    bankReferenceId: string;
    PaymentType: PaymentType;
    idempotencyKey: string;
     userId: string;
     amount: number;
     bankResponseStatus: PaymentStatus;
}
interface BankResponse {
    token: string;
    bankReferenceId:string // Assuming the bank sends back a token in the response
    // Add other properties as needed
}

export async function processPayment(idempotencyKey:string, userId:string, amount:number) {
    console.log("Processing payment for user:", userId, "Amount:", amount);

    try {
        const bankResponse = await axios.post<BankResponse>("http://localhost:4008/Demo-bank", {
            userId: userId,
            amount: amount,
        },{
            headers:{
                'Content-Type': 'application/json',
            }
        }
        );
        // retry logic if status code is not 200
        if (bankResponse && bankResponse.data && bankResponse.data.token && bankResponse.status === 200) {
            const { token, bankReferenceId } = bankResponse.data;
            console.log("Received token from bank:", token);
            const newPayment = await StoreNewPaymentRequest({idempotencyKey, userId, amount, bankReferenceId,PaymentType: PaymentType.TOP_UP, bankResponseStatus: PaymentStatus.PROCESSING});
            await sendTokenToGateway(token, userId,newPayment.id);
        } else {
            console.error("Invalid bank response:", bankResponse);
        }
    } catch (error) {
        console.error("Error communicating with the bank server:", error);
        throw new Error("Error processing payment");
    }
}