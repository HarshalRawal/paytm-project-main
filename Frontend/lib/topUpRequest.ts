import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
// export interface TopUpRequest {
//   userId: string;
//   amount: number;
// //   upi : string;
//   walletId: string;
// }

export interface TopUpRequest{
    // userId : string;
    amount : number ;
    upi : string;
}

export async function TopUpRequest({amount , upi}:TopUpRequest){
    try {
        const idempotencyKey = uuidv4();
        const response = await axios.post('http://localhost:8080/api-gateway/top-up/',{
            amount,
            upi
        },{
            headers:{
                'Content-Type': 'application/json',
                "idempotency-key": idempotencyKey,
            }
        })
        console.log("Top up request sent successfully:");
        console.dir(response, { depth: null, colors: true });
    } catch (error) {
        console.error("Error communicating with the paymentServer:", error);
    }
}

export async function WithDrawRequest({amount , upi} : TopUpRequest){
    try {
        const idempotencyKey = uuidv4();
        const response = await axios.post('http://localhost:8080/api-gateway/with-draw' , {
            
            amount ,
            upi
        }, {
            headers : {
                'Content-Type' : 'application/json',
                "idempotency-key" : idempotencyKey
            }
        })
        console.log("Withdraw request sent successfully:");
        console.dir(response, { depth: null, colors: true });
    } catch (error) {
        console.error("Error communicating with the Payement Server");
    }
}
