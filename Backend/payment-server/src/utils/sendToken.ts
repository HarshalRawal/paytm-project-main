import axios from 'axios';
// Retry logic if api gateway is down
export async function sendTokenToGateway( token: string, userId: string , PaymentId: string) {
    try {
        await axios.post('http://localhost:8080/api-gateway/bank-token', {
            token,
            userId,
            PaymentId
        });
        console.log(`Token sent to API Gateway for user: ${userId} and paymentId: ${PaymentId}`);
    } catch (error) {
        console.error("Error sending token to API Gateway:", error);
        throw new Error("Error sending token to API Gateway");  
    }
}