import express from "express";
import { connectDB,disconnectDB } from "./db";
import { topUpController } from "./controller/topUpController";
import { connectKafka,disconnectKafka } from "./consumer/consumer";
import { consumeFromKafka } from "./consumer/consumer";
const app = express();

const PORT = 5007;

app.use(express.json());

app.post("/",topUpController);


async function startServer(){
    try {
        await connectDB();
        await connectKafka();
        consumeFromKafka("top-up-transactions");
        app.listen(PORT,()=>{
            console.log(`Payment server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Error starting the server: ", error);
        process.exit(1);
    }
}

process.on("SIGINT",async ()=>{
    await disconnectDB();
    await disconnectKafka();
    process.exit(0);
})
startServer();