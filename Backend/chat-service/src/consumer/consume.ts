import { Kafka, logLevel } from "kafkajs";
import { prisma } from "../db";
import { processMessages } from "../utils/processChat";
const kafka = new Kafka({
    clientId: "wallet-service",
    brokers: ["localhost:9092"],
    logLevel:logLevel.WARN
});

const consumer = kafka.consumer({ groupId: "chat-group" });
const producer = kafka.producer();
export async function connectKafka(topics:string[]) {
    try {
        await consumer.connect();
        await producer.connect();
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
        await producer.disconnect();
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
                const value = message.value.toString(); // Convert message value to a string
                const parsedMessage = JSON.parse(value); // Parse JSON
                console.log(parsedMessage);
                console.log("Message received: ", parsedMessage);
                await processMessages(parsedMessage.data);
            }
        })
      } catch (error) {
        console.error("Error consuming messages from Kafka", error);
      }
}

export const produceToApiGateway = async(data:any)=>{
    console.log("Producing to api gateway",data);

    try {
        await producer.send({
            topic:"chat-service-outgoing",
            messages:[{
                value:JSON.stringify(data)
            }]
        })
       console.log("Produced to api gateway"); 
    } catch (error:any) {
        console.error("Error producing to kafka",error.message);
    }
}
