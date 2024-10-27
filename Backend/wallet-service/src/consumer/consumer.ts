import { Kafka, logLevel } from "kafkajs";
import { prisma } from "../db/prisma";
import axios from "axios";
import { TransactionStatus } from "@prisma/client";
import { TransactionType } from "@prisma/client";
import { updateWalletBalance } from "../utils/updateWalletBalance";
import { createNewTransaction } from "../utils/newTransaction";
import { sendNotification } from "../utils/sendNotification";
const kafka = new Kafka({
    clientId: "wallet-service",
    brokers: ["localhost:9092"],
    logLevel:logLevel.WARN
});

export interface Payload {
    transactionType: TransactionType;
    bankReferenceId: string;
    userId: string;
    status: TransactionStatus;
    amount: number;
}
const consumer = kafka.consumer({ groupId: "wallet-group" });

export async function connectKafka() {
    try {
        await consumer.connect();
        console.log("Connected to Kafka broker");
        await consumer.subscribe({ topic: "top-up-transactions" });
        console.log("subscribed to top-up-transactions");
    } catch (error) {
        console.error("Error connecting to Kafka", error);
        process.exit(1);
    }
}

export async function disconnectKafka() {
    try {
        await consumer.disconnect();
        console.log("Disconnected from Kafka broker");
    } catch (error) {
        console.error("Error disconnecting from Kafka", error);
        process.exit(1);
    }
}

export async function consumeFromKafka(topic: string) {
      try {
        await consumer.run({
            eachMessage: async ({ message }) => {
                if(!message.value){
                    return;
                }
                const rawPayload = message.value.toString();
                const payload: Payload = JSON.parse(rawPayload);
                console.log("Received message", payload);
                // Update wallet balance
               const updatedWallet =  await updateWalletBalance(payload);
               // Create new Transaction
                await createNewTransaction(payload,updatedWallet.id);

                // Send notification    
                await sendNotification(payload.userId,`Successfully ${payload.transactionType}ed ${payload.amount} to your wallet`);
               
                console.log("Transaction processed successfully");
            }
        })
      } catch (error) {
        console.error("Error consuming messages from Kafka", error);
      }
}



// Define the WalletEvent interface for type safety
interface WalletEvent {
    transactionId: string;
    userId: string;
    amount: number;
    transactionType: "credit" | "debit"; // Add more types if necessary
}
