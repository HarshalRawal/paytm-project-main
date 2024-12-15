import express from "express";
import { connectDB,disconnectDB } from "./db";
import { connectProducer,disconnectProducer,backGroundEventProducer } from "./producer/producer";
import cron from "node-cron";
import { handleWebhook } from "./controllers/handleWebhook";
const app = express();
const PORT = 5002;
app.use(express.json());

 // Load from environment variables
app.post("/api/BankWebhook", handleWebhook);


cron.schedule('* * * * *', async () => {
    try {
         backGroundEventProducer("topic");
        console.log('Running a task every minute');
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});

async function start() {
   try {

     await connectDB();
     await connectProducer(); 

     app.listen(PORT, () => {
        console.log(`Bank-webhook-handler is running on port ${PORT}`);
    });
      backGroundEventProducer("top-up-transactions");
   } catch (error) {
     console.error('error starting the server',error);
     process.exit(1);
   }// Initial call if there are any events already present
}

process.on('SIGINT', async () => {
    console.log("Shutting down gracefully...");
    await disconnectProducer() // Disconnect Kafka producer
    await disconnectDB(); // Disconnect Prisma
    process.exit(0); // Exit process
});

start();
