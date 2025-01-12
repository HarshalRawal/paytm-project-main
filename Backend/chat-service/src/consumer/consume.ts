import { Kafka, logLevel } from "kafkajs";
import { processMessages } from "../utils/processChat";
const kafka = new Kafka({
    clientId: "chat-service",
    brokers: ["localhost:9092"],
    logLevel:logLevel.WARN
});

const consumer = kafka.consumer({ groupId: "chat-group"});
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
                console.log("Message received: ", parsedMessage);
                await processMessages(parsedMessage.data);
            }
        })
      } catch (error) {
        console.error("Error consuming messages from Kafka", error);
      }
}
// Assuming your Kafka producer is correctly imported
interface KafkaMessage {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    chatId?: string; // Optional field if present in your message
}

export const produceToApiGateway = async (data: KafkaMessage) => {
    console.log("Producing to API Gateway:", data);

    try {
        await producer.send({
            topic: "chat-service-outgoing", // Specify the Kafka topic clearly
            messages: [{
                value: JSON.stringify(data), // Convert message data to string
            }],
        });
        console.log("Produced to API Gateway successfully");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error producing to Kafka:", {
                errorMessage: error.message,
                stack: error.stack,
                originalData: data, // Log the original data for better context
            });
        } else {
            // Handle unexpected error types (e.g., non-Error objects)
            console.error("Unexpected error while producing to Kafka:", {
                error,
                originalData: data,
            });
        }
    }
};

