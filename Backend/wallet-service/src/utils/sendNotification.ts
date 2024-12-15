import { Decimal } from "@prisma/client/runtime/library";
import axios from "axios";

export async function sendNotification(userId: string, message: string,currentBalance:Decimal) {
    
    try {
        await axios.post("http://localhost:8080/api-gateway/wallet-notification", {
            userId,
            message,
            currentBalance
        });
    } catch (error) {
        console.error("Error sending notification", error);
    }
}