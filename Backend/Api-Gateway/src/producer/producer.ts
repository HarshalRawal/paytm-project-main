import { Kafka, logLevel } from "kafkajs";
const kafka = new Kafka({
    clientId: "bank-webhook-handler",
    brokers: ["localhost:9092"],
    logLevel:logLevel.WARN
});
const topic = "p2p-transactions"
const producer = kafka.producer();
export interface payload {
    senderId:string,
    receiverId:string,
    amount:number
}
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

export const produce = async({senderId,receiverId,amount}:payload)=>{
    try {
        await producer.send({
            topic,
            messages:[{
                value:JSON.stringify({
                    senderId,
                    receiverId,
                    amount
                  }),
               key:senderId 
            }]
        })
    } catch (error:any) {
        console.error("Error producing to kafka",error.message);
    }
}