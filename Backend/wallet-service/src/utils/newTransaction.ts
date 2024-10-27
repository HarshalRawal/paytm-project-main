import { prisma } from "../db/prisma";
import { Payload } from "../consumer/consumer";
export async function createNewTransaction({amount,status,transactionType}:Payload,walletId:string){
    try {
        const newTransaction = await prisma.transaction.create({
            data:{
                amount,
                status,
                transactionType,
                walletId
            }
        });
        return newTransaction;
    } catch (error) {
        console.error("Error creating new transaction",error);
        throw new Error("Error creating new transaction");
    }

}