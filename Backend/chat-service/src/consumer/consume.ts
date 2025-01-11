import { Kafka, logLevel } from "kafkajs";
import { prisma } from "../db";
const kafka = new Kafka({
    clientId: "wallet-service",
    brokers: ["localhost:9092"],
    logLevel:logLevel.WARN
});

const consumer = kafka.consumer({ groupId: "chat-group" });

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
                console.log("Message received: ", JSON.parse(message.value.toString()));
            }
        })
      } catch (error) {
        console.error("Error consuming messages from Kafka", error);
      }
}
