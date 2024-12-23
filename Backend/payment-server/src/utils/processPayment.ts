import { sendTokenToGateway } from "./sendToken";
import axios from "axios";
import { StoreNewPaymentRequest, StoreWithdrawRequest } from "./newPayment";
import { PaymentType, PaymentStatus } from "@prisma/client";
import { sendWithDrawToBankWebhook } from "./withDrawbankWebHook";
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

export interface UserResponse{
    userId : string;
    walletId : string;
    phone : string;
    upi : string;
}

export async function getUserInfo(upi: string): Promise<UserResponse | null> {
    console.log("Getting the user details");

    try {
        const response = await axios.post<UserResponse>("http://localhost:6001/get-user", {
            upi: upi,
        });

        const user = response.data;

        if (!user || !user.userId || !user.walletId) {
            console.log("Missing some data (userId, walletId)");
            return null;
        }

        console.log("Received user details:", user);
        return user;
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
}

export async function processPayment(idempotencyKey:string, userId:string, amount:number , type : PaymentType) {
    console.log("Processing payment for user:", userId, "Amount:", amount);

    try {
        const bankResponse = await axios.post<BankResponse>("http://localhost:4009/Demo-bank", {
            userId: userId,
            amount: amount,
            type : type
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


export async function processWithdraw(idempotencyKey:string, userId:string, amount:number , type : PaymentType) {
    console.log("Processing withdraw for user:", userId, "Amount:", amount);

    try {
        const bankResponse = await axios.post<BankResponse>("http://localhost:4009/Demo-bank", {
            userId: userId,
            amount: amount,
            type : type

        },{
            headers:{
                'Content-Type': 'application/json',
            }
        }
        );
        // retry logic if status code is not 200
        if (bankResponse && bankResponse.data && bankResponse.status === 200) {
            const {  bankReferenceId } = bankResponse.data;
            console.log("Received bankReferenceid from bank:",bankReferenceId);
            const newWithdraw = await StoreWithdrawRequest({idempotencyKey, userId, amount, bankReferenceId,PaymentType: PaymentType.WITHDRAWAL, bankResponseStatus: PaymentStatus.PROCESSING});
            // await sendTokenToGateway(token, userId,newWithdraw.id);
            // Nedd to send request to the bank webhook
            // await sendWithDrawToBankWebhook;
        } else {
            console.error("Invalid bank response:", bankResponse);
        }
    } catch (error) {
        console.error("Error communicating with the bank server:", error);
        throw new Error("Error processing payment");
    }
}