import { prisma } from "../db/prisma";
import { Payload } from "../consumer/consumer";
export async function updateWalletBalance({amount,userId}:Payload){
    try {
        const wallet = await prisma.wallet.findFirst({
            where:{
                userId
            }
        });
        if(!wallet){
            throw new Error("Wallet not found");
        }
        const updatedWallet = await prisma.wallet.update({
            where:{
                id:wallet.id
            },
            data:{
                balance:{
                    increment:amount
                }
            }
        });
        console.log(`Updated wallet balance for user ${userId} from ${wallet.balance} to ${updatedWallet.balance}`);
        return updatedWallet;
    } catch (error) {
        console.error("Error updating wallet balance",error);
        throw new Error("Error updating wallet balance");
    }
}