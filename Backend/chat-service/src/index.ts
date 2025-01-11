import express from "express"
import cors from "cors";
import { connectDB, disconnectDB } from "./db";
import { fetchChatIdHandler } from "./controllers/fetchChatIdHandler";
import { connectKafka,disconnectKafka,consumeFromKafka} from "./consumer/consume";
const topics = ["chat-service-incoming","chat-service-outgoing"];
const app = express();
const PORT = 2211;
app.use(cors());
app.use(express.json());
async function startServer(){
    try {
        await connectDB()
        await connectKafka(topics);
        consumeFromKafka();
        app.listen(PORT,()=>{
            console.log(`chat server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Error starting the  chat server: ", error);
        process.exit(1);
    }
}
//http://localhost:2211/fetchChatId
app.get("/fetchChatId",fetchChatIdHandler);
process.on("SIGINT",async ()=>{
    await disconnectDB();
    await disconnectKafka();
    process.exit(0);
})
startServer();

