import { kafka } from "../producer/producer";
import { sendMessageToReceiver } from "../controllers/chat-MessageHandler";
const consumer = kafka.consumer({ groupId: "api-gateway" });

export const consume = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "chat-service-outgoing" });

    // Handling messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) {
          console.warn("Empty message received.");
          return;
        }

        try {
          const value = message.value.toString(); // Convert to string
          const parsedMessage = JSON.parse(value); // Parse JSON
          // Log the message with formatted output
          console.log(`Received message from topic: ${topic}, partition: ${partition}`);
          console.log(parsedMessage);
          const {receiverId}  = parsedMessage;
          await sendMessageToReceiver(receiverId,parsedMessage);
        } catch (parseError) {
          console.error("Failed to parse Kafka message value:", message.value?.toString());
        }
      },
    });
  } catch (error) {
    console.error("Error consuming messages from Kafka", error);
  }
//   const sendMessageToReceiver = async (receiverId: string, message: object) => {
//     const receiverConnection = getConnection(receiverId);

//     if (receiverConnection) {
//         try {
//             const serializedMessage = JSON.stringify(message);
//             receiverConnection.send(serializedMessage); // Send the message to the connected WebSocket
//             console.log(`Message sent to receiver ${receiverId}`);
//         } catch (error) {
//             console.error(`Error sending message to receiver ${receiverId}`, error);
//         }
//     } else {
//         console.log(`Receiver ${receiverId} is not connected. Message stored in Redis.`);
//     }
// };
  // Graceful shutdown on termination signals
  process.on("SIGINT", async () => {
    console.log("Closing Kafka consumer...");
    await consumer.disconnect();
    process.exit(0);
  });
};
