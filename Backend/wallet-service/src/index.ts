import express from "express";
import cors from "cors"; // Import the CORS package
import { connectKafka, disconnectKafka, consumeFromKafka } from "./consumer/consumer"; // Combined imports
import { connectDb, disconnectDb } from "./db/prisma";
import { prisma } from "./db/prisma";
import { PrismaClient } from "@prisma/client";

const app = express();

// Add CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', // Change this to your frontend origin
    credentials: true // Allow cookies to be sent
}));

app.use(express.json());
const prismaClient = new PrismaClient();

// Health Check Endpoint
app.get("/health", async (req, res) => {
    try {
        // Optionally, check the health of Kafka and Database connections here
        res.status(200).send("Wallet service is healthy!");
    } catch (error) {
        res.status(500).send("Service is unhealthy");
    }
});

app.post("/create-wallet", async (req, res) => {
    const body = req.body;
    const userId = body.userId;
    try {
        const newUser = await prismaClient.wallet.create({
            data: {
                balance: 0,
                userId: userId
            }
        });

        const walletId = newUser.id;
        console.log(`new wallet is created for userId - ${userId} with walletid - ${newUser.id}`);
        res.status(200).json(walletId);
    } catch (error) {
        console.log("error while creating a wallet", error);
        res.status(400).send(error);
    }
})
// Example route for top-up (add more routes as needed)
// app.post("/topup", handleTopUp);

const PORT = process.env.PORT || 8086;

app.listen(PORT, () => {
    console.log(`Wallet service is running on port ${PORT}`);
});

async function start() {
    try {
        await connectKafka();
        await connectDb();
        consumeFromKafka("top-up-transactions");
    } catch (error) {
        console.error("Error starting the service:", error);
        process.exit(1); // Exit if unable to start
    }
}

process.on('SIGINT', async () => {
    console.log("Shutting down gracefully...");
    try {
        await disconnectKafka(); // Disconnect Kafka
        await disconnectDb(); // Disconnect Database
        console.log("Disconnected from Kafka and Database");
    } catch (error) {
        console.error("Error during shutdown:", error);
    } finally {
        process.exit(0); // Exit process
    }
});

start();