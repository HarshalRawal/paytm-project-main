import axios from "axios";

export async function sendNotification(userId: string, message: string){
    
    try {
        await axios.post("http://localhost:8080/api-gateway/wallet-notification", {
            userId,
            message,
        });
    } catch (error) {
        console.error("Error sending notification", error);
    }
}