import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
interface P2pPaymentRequest{
    pin : number;
    senderId : string;
    receiverId : string;
    amount : number;
    message? : string;
}

export async function P2pPaymentRequest({senderId,receiverId,amount,message,pin}:P2pPaymentRequest){
    try {
        const idempotencyKey = uuidv4();
        const response = await axios.post('http://localhost:8080/api-gateway/p2pTransaction',{
            senderId,
            pin,
            receiverId,
            amount,
            message
        },{
            headers:{
                'Content-Type': 'application/json',
                "idempotency-key": idempotencyKey,
            }
        })
        console.log("P2p payment request sent successfully:",response);
        return response.data;
    } catch (error) {
        console.error("Error communicating with the WalletServer:", error);
    }
}

export async function checkWalletBalance(userId: string,amount: number){
    try {
        const response = await axios.post('http://localhost:8080/api-gateway/checkBalance/',{
            userId: userId,
            amount: amount
        })
        console.log("Wallet balance checked successfully:",response);
        return response.data;
    } catch (error) {
        console.error("Error communicating with the WalletServer:", error);
    }
}
