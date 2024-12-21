import { Decimal } from "@prisma/client/runtime/library";
import axios from "axios";
import { Transaction } from "@prisma/client";
export async function sendNotification(userId: string, message: string,currentBalance:Decimal,newTransaction:Transaction) {
    
    try {
        // Adding a delay of 2 seconds before sending the notification
        await new Promise(resolve => setTimeout(resolve, 200));
        await axios.post("http://localhost:8080/api-gateway/wallet-notification", {
            userId,
            message,
            currentBalance,
            newTransaction
        });
    } catch (error) {
        console.error("Error sending notification", error);
    }
}