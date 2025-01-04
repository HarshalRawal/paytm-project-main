// src/kafkaHandlers/handleTopUpTransaction.ts
import { Payload } from "../consumer/consumer";
import { updateWalletBalance } from "../utils/updateWalletBalance";
import { createNewTransaction } from "../utils/newTransaction";
import { sendNotification } from "../utils/sendNotification";

export async function handleTopUpTransaction(rawMessage: Buffer) {
    const rawPayload = rawMessage.toString();
    const payload: Payload = JSON.parse(rawPayload);

    console.log("Processing top-up transaction", payload);

    // Update wallet balance
    const updatedWallet = await updateWalletBalance(payload);

    if (!updatedWallet) {
        console.log("Updated wallet is null");
        return;
    }

    // Create a new transaction
    const newTransaction = await createNewTransaction(payload, updatedWallet.id);

    // Send notification
    await sendNotification(
        payload.userId,
        `Successfully ${payload.transactionType}ed ${payload.amount} to your wallet`,
        updatedWallet.balance,
        newTransaction
    );

    console.log("Top-up transaction processed successfully");
}
