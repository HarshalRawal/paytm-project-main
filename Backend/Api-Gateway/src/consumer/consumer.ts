import { Kafka } from "kafkajs";
import { kafka } from "../producer/producer";
const consumer = kafka.consumer({ groupId: "api-gateway" });
export const consume = async () => {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: "chat-service-outgoing" });
      await consumer.run({
        eachMessage: async ({ topic, message }) => {
          if (!message.value) {
            console.warn("Empty message received.");
            return;
          }
  
          try {
            const value = message.value.toString(); // Convert to string
            const parsedMessage = JSON.parse(value); // Parse JSON
  
            // Use JSON.stringify to log the object properly
            console.log(`Received message: ${JSON.stringify(parsedMessage, null, 2)}`);
          } catch (parseError) {
            console.error("Failed to parse Kafka message value:", message.value?.toString());
          }
        },
      });
    } catch (error) {
      console.error("Error consuming messages from Kafka", error);
    }
  };
  