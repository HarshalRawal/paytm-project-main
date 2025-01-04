import { prisma } from "../../db/prisma";
export const updateBalances = async (senderId: string, receiverId: string, amount: number) => {
    return await prisma.$transaction(async (prisma) => {
        const sender = await prisma.wallet.update({
            where: { userId: senderId },
            data: { balance: { decrement: Number(amount) } },
            select: { balance: true },
        });

        const receiver = await prisma.wallet.update({
            where: { userId: receiverId },
            data: { balance: { increment: Number(amount) } },
            select: { balance: true },
        });

        return { senderBalance: sender.balance, receiverBalance: receiver.balance };
    });
}