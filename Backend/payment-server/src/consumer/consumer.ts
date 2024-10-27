import { Kafka, logLevel } from "kafkajs";
import { PaymentType,PaymentStatus } from "@prisma/client";
import { updatePaymentTable } from "../utils/updatePaymentTable";
const kafka = new Kafka({
  clientId: "payment-server",
  brokers: ["localhost:9092"],
  logLevel:logLevel.WARN
});

export interface Payload {
    transactionType: PaymentType;
    bankReferenceId: string;
    userId: string;
    status: PaymentStatus;
    amount: number;
}
const consumer = kafka.consumer({ groupId: "payment-group" });

export async function connectKafka(){
    try {
        await consumer.connect();
        console.log(`Consumer connected to Kafka broker successfully`);
        await consumer.subscribe({ topic: "top-up-transactions" });
        console.log("Subscribed to top-up-transactions topic");
    } catch (error) {
        console.error("Error connecting to Kafka Broker",error);
        process.exit(1);
    }
}

export async function disconnectKafka(){
    try {
        await consumer.disconnect();
        console.log("Successfully disconnected from kafka broker");
    } catch (error) {
        console.error("Error disconnecting from kafka broker");
        process.exit(1);
    }
}
// top-up-transactions
export   async function consumeFromKafka(topic:string){
    try {
        consumer.run({
            eachMessage: async ({ message }) => {
                if(!message.value){
                    return;
                } 
                console.log("Received message from Kafka");
                const rawMessage = message.value.toString();
                const payload: Payload = JSON.parse(rawMessage);
                console.log("Payload",payload);
                await updatePaymentTable(payload);
            },
        })
    } catch (error) {
        console.error("Error consuming message from Kafka",error);
        throw new Error("Error consuming message from Kafka");
    }
}