import axios from 'axios';

export async function sendNotificationToApiGateway(transactionStatus:string,message:string,amount:number,userId:string){

    if(!transactionStatus || !message || !amount || !userId){
        throw new Error('Missing required fields to send notification to API Gateway');
    }
    if(transactionStatus === 'SUCCESS'){
        message = `${message} adding ${amount} to wallet`;
    }
    else{
        message = message;
    }
    try {
        await axios.post('http://localhost:8080/api-gateway/bank-wehook-notification', {
            transactionStatus,
            message,
            userId
        });
        console.log(`Notification sent to API Gateway for user: ${userId}`);
    } catch (error) {
        console.error("Error sending notification to API Gateway:", error);
    }
}