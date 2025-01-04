import { prisma } from "../../db/prisma";
import { TransactionStatus } from "@prisma/client";
import { TransactionType } from "@prisma/client";

export const createTransactions = async (senderId: string, receiverId: string, amount: number, senderWalletId: string, receiverWalletId: string) => {
    return await prisma.$transaction(async (prisma) => {
        const senderTransaction = await prisma.transaction.create({
            data: {
                amount,
                status: TransactionStatus.PROCESSING,
                transactionType: TransactionType.P2P_TRANSFER,
                from: senderId,
                to: receiverId,
                walletId: senderWalletId,
            },
        });

        const receiverTransaction = await prisma.transaction.create({
            data: {
                amount,
                status: TransactionStatus.PROCESSING,
                transactionType: TransactionType.P2P_TRANSFER,
                from: senderId,
                to: receiverId,
                walletId: receiverWalletId,
            },
        });

        return { senderTransaction, receiverTransaction };
    });
};


export const updateTransactionStatus = async (senderTransactionId: string, receiverTransactionId: string) => {
    return await prisma.$transaction(async (prisma) => {
        const senderTransaction = await prisma.transaction.update({
            where: { id: senderTransactionId },
            data: { status: TransactionStatus.SUCCESS },
        });

        const receiverTransaction = await prisma.transaction.update({
            where: { id: receiverTransactionId },
            data: { status: TransactionStatus.SUCCESS },
        });

        return { senderTransaction, receiverTransaction };
    });
};