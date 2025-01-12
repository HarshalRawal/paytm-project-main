import express from 'express';
import { createServer } from 'http';
import WebSocket from 'ws';
import { idempotencyMiddleware } from './middleware/idempotencyMiddleware';
import { topUpProxy, withDrawProxy } from './routes/route';
import { handleMessage } from './controllers/chat-MessageHandler';
import cors from 'cors';
import { getBalanceHanler,checkBalanceHandler } from './utils/getBalance';
import * as url from 'url';
import axios from 'axios';
import { handleTransactionRequest } from './routes/transactionsProxy';
import { updateTransactionInCache} from './redis/redisClient';
import {updateBalanceInRedis } from './redis/redisBalance'
import { p2pTransactionHandler } from './utils/getTransaction';
import { connectProducer,disconnectProducer,produceToChatService } from './producer/producer';
import authenticateJWT from './middleware/authenticateJWT';
import { consume } from './consumer/consumer';
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization','Idempotency-Key'],
}));


app.use("/api-gateway/top-up"  ,idempotencyMiddleware , authenticateJWT, topUpProxy);
app.use("/api-gateway/with-draw" ,  idempotencyMiddleware, authenticateJWT ,withDrawProxy);


app.get("/transactions",authenticateJWT, handleTransactionRequest);


// Create an HTTP server to host both the REST API and WebSocket server
const server = createServer(app)

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Map to store WebSocket connections for each user ID
export const activeClients: Map<string, WebSocket> = new Map();

export const getConnection = (userId: string): WebSocket | undefined => {
    return activeClients.get(userId);
};

// Handle WebSocket connections
wss.on('connection', (ws,req) => {
    const reqUrl = req.url || '';
    const queryParams = url.parse(reqUrl,true).query
    const userId = queryParams.userId as string;
    

    if(!userId){
        ws.close(1008, 'User ID is required');
        return;
    }
    console.log(`web-socket connection established for userId ${userId}`);
    activeClients.set(userId, ws);
    onWebSocketConnection(ws,userId);

    ws.on("message",async(message:any)=>{
       const data = JSON.parse(message);
       await produceToChatService(data);
    })
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
app.post('/api-gateway/bank-wehook-notification' ,async (req,res)=>{
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

const pendingNotifications = new Map(); // Key: userId, Value: Array of notifications

app.post('/api-gateway/wallet-notification', async (req, res) => {
    const { message, userId, currentBalance, newTransaction } = req.body;
    console.log('Received wallet notification:', req.body);
    console.log(`Updating transaction in cache for userId: ${userId}`);
    const cacheKey = `transactions:${newTransaction.walletId}:*:10`;
   const { transactions = [], nextCursor = null } = await updateTransactionInCache(cacheKey, newTransaction) || {};
   console.log("transactions to send to frontend:",transactions);
    const clientSocket = activeClients.get(userId);
    const notification = {
        event: "wallet-notification",
        data: { message, currentBalance, transactions,nextCursor },
    };
    if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(JSON.stringify(notification));
    } else {
        console.error(`WebSocket connection for userId ${userId} is not open.`);
        // Store notification for later delivery
        if (!pendingNotifications.has(userId)) {
            pendingNotifications.set(userId, []);
        }
        pendingNotifications.get(userId).push(notification);
    }

    try {
        console.log(`updating balance in cache for userId: ${userId}`);
        await updateBalanceInRedis(userId,currentBalance);
    } catch (error) {
        console.error('Error updating cache:', error);
    }

    res.send({ message: 'Notification received successfully from wallet-service' });
});

// Deliver pending notifications when the client reconnects
function onWebSocketConnection(clientSocket: WebSocket, userId: string) {
    activeClients.set(userId, clientSocket);

    if (pendingNotifications.has(userId)) {
        const notifications = pendingNotifications.get(userId);
        notifications.forEach((notification: any) => {
            clientSocket.send(JSON.stringify(notification));
        });
        pendingNotifications.delete(userId); // Clear delivered notifications
    }
}

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

app.post('/api-gateway/getBalance',getBalanceHanler);

app.post('/api-gateway/checkBalance',checkBalanceHandler);


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


app.post('/api-gateway/search/user', async (req, res) => {

    const { searchParameter } = req.body;
    console.log(`Checking if ${searchParameter} exists`);
    try {
        const response = await axios.post('http://localhost:6001/is-user/', {
            searchParameter: searchParameter
        });
        console.log(`Response from user service: ${response.data}`);
        res.status(200).json({data:response.data});
        return;
    } catch (error) {
        console.error(`Error checking if ${searchParameter} exists: ${error}`);
        res.status(500).send({ error: 'Internal server error' });
        return;
    }
});

//'http://localhost:8080/api-gateway/addContact
app.post('/api-gateway/addContact', async (req, res) => {

    const { contactUsername, userId } = req.body;
   console.log(`Adding contact: ${contactUsername} for userId: ${userId}`);
    try {
      // Forward the request to the user service
      const response = await axios.post('http://localhost:6001/addContact', {
        contactUsername,
        userId,
      });
  
      console.log(`Contact added: ${JSON.stringify(response.data)}`);
  
      // Return the response from the user service in JSON format
      res.status(200).json({
        message: 'Contact added successfully via API Gateway',
        data: response.data,
      });
    } catch (error) {
      console.error(`Error adding contact: ${error}`);
      // Include additional details in the error response if available
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  });

app.get(`/api-gateway/getContact` ,async (req, res) => {

    const userId = req.query.userId as string;
    console.log(`Getting contacts for userId: ${userId}`);
    try {
        const response = await axios.get(`http://localhost:6001/getContact`, {
            params: { userId: userId }
        });
        console.log(`getContact response: ${response.data}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Failed to fetch contacts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
// Start the server


app.post('/api-gateway/p2pTransaction',p2pTransactionHandler);

app.get('/api-gateway/getChats')
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

async function start() {
    try {
      await connectProducer();
      consume(); 
      server.listen(8080, () => {
        console.log('API Gateway is running on port 8080');
    });
    } catch (error) {
      console.error('error starting the server',error);
      process.exit(1);
    }// Initial call if there are any events already present
 }
 
 process.on('SIGINT', async () => {
     console.log("Shutting down gracefully...");
     await disconnectProducer()
     wss.clients.forEach(client => {
        client.close();
    });
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
 });
 
 start();

