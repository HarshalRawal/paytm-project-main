import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
export interface TopUpRequest {
  userId: string;
  amount: number;
  walletId: string;
}

export async function TopUpRequest({userId,amount,walletId}:TopUpRequest){
    try {
        const idempotencyKey = uuidv4();
        const respone = await axios.post('http://localhost:8080/api-gateway/top-up/',{
            userId,
            amount,
            walletId
        },{
            headers:{
                'Content-Type': 'application/json',
                "idempotency-key": idempotencyKey,
            }
        })
        console.log("Top up request sent successfully:",respone);
    } catch (error) {
        console.error("Error communicating with the paymentServer:", error);
    }
}
