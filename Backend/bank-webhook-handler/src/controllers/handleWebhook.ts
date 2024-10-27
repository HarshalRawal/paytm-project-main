import { Request, Response } from "express";
import { verifySignature } from "../utils/verifySignature";
import { storePayload, Payload } from "../utils/storePayload";
import { sendNotificationToApiGateway } from "../utils/notificationToApi-Gateway";
import { produceToKafka } from "../producer/producer";

const HMAC_SECRET = "mysecretkey";

export async function handleWebhook (req: Request, res: Response) {
    console.log("Received webhook request from bank");

    const signature = req.headers['bank-signature'];
    
    // Validate signature
    if (!signature || typeof signature !== "string") {
        console.error("Invalid or missing signature");
        res.status(400).json({ error: "Invalid or missing signature" });
        return;
    }

    const payloadString = JSON.stringify(req.body);
    console.log("Payload String:", payloadString);

    // Verify the signature
    const verifySignatureResult = verifySignature(payloadString, signature, HMAC_SECRET);
    if (!verifySignatureResult) {
        console.error("Invalid signature");
        res.status(400).json({ error: "Invalid signature" });
        return;
    }

    // Parse the payload
    let payload: Payload;
    try {
        payload = JSON.parse(payloadString);
    } catch (error) {
        console.error("Error parsing payload:", error);
        res.status(400).json({ error: "Invalid payload format" });
        return;
    }

    // Validate required fields
    const { transactionType, bankReferenceId, userId, status, amount } = payload;
    if (!transactionType || !bankReferenceId || !userId || !status || !amount) {
        console.error("Missing required fields in payload:", payload);
         res.status(400).json({ error: "Missing required fields in payload" });
         return;
    }

    const message = status === "SUCCESS" ? "Transaction successful" : "Transaction failed due to insufficient funds";
    console.log("Received webhook payload:", payload);

    try {
        // Send notification to API Gateway
        await sendNotificationToApiGateway(status, message, amount, userId);
        
        // Store the payload in the outbox
        const newOutbox = await storePayload(payload);

         res.status(200).json({ message: "Webhook received and processed successfully for bank reference ID: " + bankReferenceId });

         await produceToKafka("top-up-transactions", newOutbox.id);

    } catch (error) {
        console.error("Error processing webhook:", error);
         res.status(500).json({ error: "Internal server error" });
         return;
    }
}