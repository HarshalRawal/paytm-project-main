
import { fetchWallet } from "../utils/p2p/fetchWallet"
import { createTransactions,updateTransactionStatus } from "../utils/p2p/newP2ptransaction"
import { updateBalances } from "../utils/p2p/p2pWalletUpdate"
import { sendNotification } from "../utils/sendNotification"
interface p2pPayload{
    senderId:string,
    receiverId:string,
    amount:number,
    message?:string
}
export const p2pTransactionHandler = async (rawMessage:Buffer) => {
    console.log("Received P2P transaction request");

    const rawPayload = rawMessage.toString();
    const payload: p2pPayload = JSON.parse(rawPayload);
    console.log("Processing p2p-transaction", payload);
    const {senderId,receiverId,amount} = payload

    if (!senderId || !receiverId || !amount || amount <= 0) {
        console.log("Invalid input data");
        return 
    }

    try {
        // Fetch wallets for both sender and receiver
        const senderWalletId = await fetchWallet(senderId);
        const receiverWalletId = await fetchWallet(receiverId);

        // Create transactions for both sender and receiver inside a transaction
        const { senderTransaction, receiverTransaction } = await createTransactions(senderId, receiverId, amount, senderWalletId, receiverWalletId);

        // Update wallet balances for both sender and receiver inside a transaction
        const { senderBalance, receiverBalance } = await updateBalances(senderId, receiverId, amount);

        // Update the status of both sender and receiver transactions to SUCCESS inside a transaction
        const { senderTransaction: updatedSenderTransaction, receiverTransaction: updatedReceiverTransaction } = await updateTransactionStatus(senderTransaction.id, receiverTransaction.id);

        console.log("P2P transaction processed successfully");

        // Send notifications to the sender and receiver
        await sendNotification(senderId, "P2P transfer", senderBalance, updatedSenderTransaction);
        await sendNotification(receiverId, "P2P transfer", receiverBalance, updatedReceiverTransaction);
        console.log(`Successfully processed p2p request for senderId:${senderId} and ReceiverId:${receiverId}`)
    } catch (error: any) {
        console.error(`Error during P2P transaction: ${error.message}`);
    }
};