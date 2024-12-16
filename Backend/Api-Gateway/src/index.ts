import express from 'express';
import { createServer } from 'http';
import WebSocket from 'ws';
import { idempotencyMiddleware } from './middleware/idempotencyMiddleware';
import { topUpProxy } from './routes/route';
import cors from 'cors';
import { getBalance } from './utils/getBalance';
import * as url from 'url';
const app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use("/api-gateway/top-up", idempotencyMiddleware, topUpProxy);

// Create an HTTP server to host both the REST API and WebSocket server
const server = createServer(app)

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Map to store WebSocket connections for each user ID
const activeClients: Map<string, WebSocket> = new Map();

// Handle WebSocket connections
wss.on('connection', (ws,req) => {
    const reqUrl = req.url || '' ;
    const queryParams = url.parse(reqUrl,true).query
    const userId = queryParams.userId as string;
    

    if(!userId){
        ws.close(1008, 'User ID is required');
        return;
    }
    console.log(`web-socket connection established for userId ${userId}`);
    activeClients.set(userId, ws);
    // Handle client disconnection
    ws.on('close', () => {
        console.log(`WebSocket connection closed for userId ${userId}`);
        activeClients.delete(userId);
    });
    ws.on('error', (error) => {
        console.error(`WebSocket error for userId ${userId}:`, error);
        activeClients.delete(userId); // Remove on error as well
    });
});
app.post('/api-gateway/bank-wehook-notification',async (req,res)=>{
    const {transactionStatus,message,userId} = req.body;
    res.send({message: 'Webhook notification received successfully from bank-webhook'});
    const clientSocket = activeClients.get(userId);
    if(clientSocket && clientSocket.readyState === WebSocket.OPEN){
        clientSocket.send(JSON.stringify({event:"bank-webhook",data:{transactionStatus,message}}));
        console.log(`Sent webhook notification to client for userId: ${userId}`);
    }
    else{
        console.error(`WebSocket connection for userId ${userId} is not open.`);
    }
})

app.post('/api-gateway/wallet-notification',async (req,res)=>{
    const {message,userId,currentBalance} = req.body;
    res.send({message: 'Notification received successfully from wallet-service'});
    const clientSocket = activeClients.get(userId);
    if(clientSocket && clientSocket.readyState === WebSocket.OPEN){
        clientSocket.send(JSON.stringify({event:"wallet-notification",data:{message,currentBalance}}));
        console.log(`Sent notification to client for userId: ${userId}`);
    }
    else{
        console.error(`WebSocket connection for userId ${userId} is not open.`);
    }
}) 
// Endpoint to receive the bank token from Payment Service
app.post('/api-gateway/bank-token', (req, res) => {
    const { token ,userId ,PaymentId   } = req.body; // Include userId

    if (!PaymentId || !token || !userId) {
        res.status(400).json({ error: 'Transaction ID, token, and user ID are required' });
        return;
    }
    const clientSocket = activeClients.get(userId);
    if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
        const redirectUrl = `http://localhost:1000/Demo-bank/net-banking/${token}`;
        clientSocket.send(JSON.stringify({event:"Bank-Token",data:{PaymentId, redirectUrl,token} }));
        console.log(`Sent bank token for Payment ID: ${PaymentId} to client`);
    } else {
        console.error(`WebSocket connection for userId ${userId} is not open.`);
    }
    res.status(200).json({ message: 'Token received and sent to client' });
});
 app.post('/api-gateway/getBalance',async (req,res)=>{
try {
        const userId = req.body.userId;
        console.log(`Getting balance for userId: ${userId}`);
        const balance = await getBalance(userId);
        res.status(200).json(balance);
} catch (error) {
    console.error('Error getting balance:', error);
}
    });
app.post('/wallet-service',async (req,res)=>{
    const amount = req.body.amount;
    const walletId = req.body.walletId;
    const userId = req.body.userId;

    const clientSocket = activeClients.get(userId);
    if(clientSocket && clientSocket.readyState === WebSocket.OPEN){
        clientSocket.send(JSON.stringify({amount,walletId}));
        console.log(`Sent amount to wallet service for walletId: ${walletId}`);
    }
    res.send({message: 'message  sent to frontend successfully'});
})
// Start the server
server.listen(8080, () => {
    console.log('API Gateway is running on port 8080');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    wss.clients.forEach(client => {
        client.close();
    });
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
