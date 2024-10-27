import { Kafka, logLevel } from "kafkajs";
import { storePayload } from "../utils/storePayload";
import { prisma } from "../db";
import { Payload } from "../utils/storePayload";
const kafka = new Kafka({
    clientId: "bank-webhook-handler",
    brokers: ["localhost:9092"],
    logLevel:logLevel.WARN
});

const producer = kafka.producer();

export async function connectProducer(){
    try {
        await producer.connect();
        console.log(`Producer connected to Kafka broker successfully`);
    } catch (error) {
        console.error("Error connecting to Kafka Broker",error);
        process.exit(1);
    }
}

export async function disconnectProducer(){
    try {
        await producer.disconnect();
        console.log("Successfully disconnected from kafka broker");
    } catch (error) {
        console.error("Error disconnecting from kafka broker");
        process.exit(1);
    }
}
export const produceToKafka = async (topic: string, outboxId: string) => {
    try {
        // Use a transaction to ensure all operations are atomic
        await prisma.$transaction(async (prisma) => {
            // Lock the event to prevent duplicate processing
            await prisma.outbox.update({
                where: { id: outboxId },
                data: { locked: true },
            });

            const event = await prisma.outbox.findUnique({
                where: { 
                    id: outboxId,
                    published: false,
                },

            });

            // Ensure the event exists and hasn't been published yet
            if (!event || event.published) {
                console.log(`Event ${outboxId} is already processed or not found`);
                return;
            }

            const payload = event.Payload as Payload | null;

            // Validate payload
            if (!payload) {
                console.error(`No payload found for event ID: ${outboxId}`);
                throw new Error("Invalid payload");
            }

            const { transactionType, bankReferenceId, userId, status, amount } = payload;

            // Publish the event to Kafka
            try {
                await producer.send({
                    topic,
                    messages: [
                        {
                            value: JSON.stringify({
                                transactionType,
                                bankReferenceId,
                                userId,
                                status,
                                amount,
                            }),
                        },
                    ],
                });
                console.log(`Successfully published event: ${outboxId}`);
            } catch (sendError) {
                // Type guard to check if sendError is an instance of Error
                if (sendError instanceof Error) {
                    console.error(`Error sending message to Kafka for event ${outboxId}:`, sendError.message);
                    throw new Error(`Kafka send error: ${sendError.message}`);
                } else {
                    console.error(`Unexpected error sending message to Kafka for event ${outboxId}:`, sendError);
                    throw new Error("Unexpected error sending message to Kafka");
                }
            }
            // Update the event to mark it as published
            await prisma.outbox.update({
                where: { id: outboxId },
                data: { published: true, locked: false },
            });
        });
    } catch (error) {
        console.error(`Error publishing outbox event:`, error);
        throw new Error("Error publishing outbox event");
    }
};


// backGroundEventProducer function
export async function backGroundEventProducer(topic:string) {
    try {
         await prisma.$transaction (async (prisma)=>{
           
            const unpublishedEvents = await prisma.outbox.findMany({
                where:{
                    published: false,
                    locked: false,
                }
            })
            
            if(unpublishedEvents.length === 0){
                console.log("No unpublished events found");
                return;
            }
            await prisma.outbox.updateMany({
                where: {
                    id: {
                        in: unpublishedEvents.map((event) => event.id),
                    },
                },
                data: {  // Set published status to true
                    locked: true,     // Unlock the entries
                },
            });
            for (const event of unpublishedEvents) {
                const payload = event.Payload as Payload | null;
                if (!payload) {
                    console.error(`No payload found for event ID: ${event.id}`);
                    continue;
                }
                const { transactionType, bankReferenceId, userId, status, amount } = payload;
                try {
                    await producer.send({
                        topic,
                        messages: [
                            {
                                value: JSON.stringify({
                                    transactionType,
                                    bankReferenceId,
                                    userId,
                                    status,
                                    amount,
                                }),
                            },
                        ],
                    });
                    console.log(`Successfully published event: ${event.id}`);
                } catch (sendError) {
                    if (sendError instanceof Error) {
                        console.error(`Error sending message to Kafka for event ${event.id}:`, sendError.message);
                        throw new Error(`Kafka send error: ${sendError.message}`);
                    } else {
                        console.error(`Unexpected error sending message to Kafka for event ${event.id}:`, sendError);
                        throw new Error("Unexpected error sending message to Kafka");
                    }
                }
                await prisma.outbox.update({
                    where: { id: event.id },
                    data: { published: true, locked: false },
                });
            }
         })
    } catch (error) {
      console.error(`Error in backgroundEventProducer`, error);
    }
  }

