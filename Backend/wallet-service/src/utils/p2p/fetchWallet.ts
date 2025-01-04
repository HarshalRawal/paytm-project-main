import { prisma } from "../../db/prisma";

export const fetchWallet = async (userId: string) => {
    const wallet = await prisma.wallet.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (!wallet?.id) {
        throw new Error(`Failed to fetch wallet for user: ${userId}`);
    }
    return wallet.id;
};