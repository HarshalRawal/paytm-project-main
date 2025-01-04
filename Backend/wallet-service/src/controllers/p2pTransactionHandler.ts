import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { sendNotification } from "../utils/sendNotification";
import { Decimal } from "@prisma/client/runtime/library";

export const p2pTransactionHandler = async (req: Request, res: Response) => {
    console.log("Received p2p transaction request");
    const { senderId, receiverId, amount } = req.body;

    if (!senderId || !receiverId || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    let senderBalance: Decimal | null = null,
        receiverBalance: Decimal | null = null;

    try {
        // Fetch wallets
        const senderWallet = await prisma.wallet.findUnique({ where: { userId: senderId }, select: { id: true } });
        if (!senderWallet?.id) throw new Error("Failed to fetch sender wallet");

        const receiverWallet = await prisma.wallet.findUnique({ where: { userId: receiverId }, select: { id: true } });
        if (!receiverWallet?.id) throw new Error("Failed to fetch receiver wallet");

        // Perform all operations in a single transaction
        await prisma.$transaction(async (prisma) => {
            // Create sender transaction
            const senderTransaction = await prisma.transaction.create({
                data: {
                    amount,
                    status: TransactionStatus.PROCESSING,
                    transactionType: TransactionType.P2P_TRANSFER,
                    from: senderId,
                    to: receiverId,
                    walletId: senderWallet.id,
                },
            });

            // Decrement sender balance
            const updatedSenderWallet = await prisma.wallet.update({
                where: { userId: senderId },
                data: { balance: { decrement: Number(amount) } },
                select: { balance: true },
            });

            senderBalance = updatedSenderWallet.balance;

            // Create receiver transaction
            const receiverTransaction = await prisma.transaction.create({
                data: {
                    amount,
                    status: TransactionStatus.PROCESSING,
                    transactionType: TransactionType.P2P_TRANSFER,
                    from: senderId,
                    to: receiverId,
                    walletId: receiverWallet.id,
                },
            });

            // Increment receiver balance
            const updatedReceiverWallet = await prisma.wallet.update({
                where: { userId: receiverId },
                data: { balance: { increment: Number(amount) } },
                select: { balance: true },
            });

            receiverBalance = updatedReceiverWallet.balance;

            // Update transaction statuses
            const updatedSenderTransaction = await prisma.transaction.update({
                where: { id: senderTransaction.id },
                data: { status: TransactionStatus.SUCCESS },
            });

            const updatedReceiverTransaction = await prisma.transaction.update({
                where: { id: receiverTransaction.id },
                data: { status: TransactionStatus.SUCCESS },
            });

            console.log("P2P transaction processed successfully");

            // Send the updated transactions to notification
            await sendNotification(senderId, "P2P transfer", senderBalance, updatedSenderTransaction);
            await sendNotification(receiverId, "P2P transfer", receiverBalance, updatedReceiverTransaction);
        });

        res.status(200).json({ message: "P2P transaction completed successfully" });
    } catch (error: any) {
        console.error(`Error during P2P transaction: ${error.message}`);
        res.status(500).json({ message: "P2P transaction failed", error: error.message });
    }
};

