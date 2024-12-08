import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../db/prisma";

export const walletBalance = async (userId: string) => {
    const balance = await prisma.wallet.findUnique({
        where: {
            userId,
        },
        select: {
            balance: true,
        },
    });
    if (!balance) {
        return 0;
    }
    return balance.balance;
}