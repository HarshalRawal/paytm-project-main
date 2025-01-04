import { Kafka, logLevel } from "kafkajs";
import { prisma } from "../db/prisma";
import axios from "axios";
import { TransactionStatus } from "@prisma/client";
import { TransactionType } from "@prisma/client";
import { handleTopUpTransaction } from "../topicHandlers/top-up-transaction";
import { p2pTransactionHandler } from "../topicHandlers/p2p-transactions";
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

export async function connectKafka(topics:string[]) {
    try {
        await consumer.connect();
        console.log("Connected to Kafka broker");
        await consumer.subscribe({ topics });
        console.log(`subscribed to topics: ${topics} `);
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

export async function consumeFromKafka() {
      try {
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                if(!message.value){
                    return;
                }
                switch (topic) {
                    case "top-up-transactions":
                        await handleTopUpTransaction(message.value);
                        break;
                    case "p2p-transactions":
                        await p2pTransactionHandler(message.value);    
                    default:
                        break;
                }
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
