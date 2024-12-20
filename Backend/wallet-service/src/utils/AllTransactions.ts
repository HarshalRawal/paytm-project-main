import { prisma } from "../db/prisma";

export async function getTransactions(walletId: string, cursor: string | null, limit: number) {
  const whereClause = cursor
    ? { walletId, createdAt: { lt: new Date(cursor) } }
    : { walletId };

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  // Determine the next cursor
  const nextCursor = transactions.length > 0
    ? transactions[transactions.length - 1].createdAt.toISOString()
    : null;

  return {
    transactions,
    nextCursor,
  };
}
