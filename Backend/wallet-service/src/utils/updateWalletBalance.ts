import { prisma } from "../db/prisma";
import { Payload } from "../consumer/consumer";
import { Decimal } from 'decimal.js';
export async function updateWalletBalance({amount,userId , transactionType}:Payload){

    if(transactionType ==  "TOP_UP"){
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
    }else{
        try {
            const wallet = await prisma.wallet.findFirst({
                where:{
                    userId
                }
            });
            if(!wallet){
                throw new Error("Wallet not found");
            }

            if (new Decimal(amount).greaterThan(wallet.balance)) {
                console.log("Entered amount is greater than the Wallet Balance ")
                return;
            }
            
            const updatedWallet = await prisma.wallet.update({
                where:{
                    id:wallet.id
                },
                data:{
                    balance:{
                        decrement:amount
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
    
}

