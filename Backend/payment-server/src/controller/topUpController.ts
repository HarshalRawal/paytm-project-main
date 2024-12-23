import { Request, Response } from 'express';
import { getUserInfo, processPayment } from '../utils/processPayment';
import { PaymentType } from '@prisma/client';
import { UserResponse } from '../utils/processPayment';
export const topUpController = async(req: Request, res: Response) => {
    console.log("Received top-up request");

    // send the upi to the user to get the userID and walletId
    const {upi , amount , idempotencyKey} = req.body;
    
    const user: UserResponse|null = await getUserInfo(upi);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

    // const { amount, userId ,walletId,idempotencyKey} = req.body;
    if (!amount || !user.userId || !user.walletId || !idempotencyKey) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    console.log(`${amount} top-up request received for user ${user.userId} and wallet ${user.walletId}`);
    // L
    res.status(200).json({ message: "top-up request is being processed" });
    try {
        await processPayment(idempotencyKey, user.userId, amount ,PaymentType.TOP_UP);
    } catch (error) {
        
    }
}