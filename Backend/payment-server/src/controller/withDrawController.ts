import { Request, Response } from 'express';
import {  getUserInfo, processWithdraw, UserResponse } from '../utils/processPayment';
import { PaymentType } from '@prisma/client';
export const withDrawController = async(req: Request, res: Response) => {
    console.log("Received withdraw request");

    //send the upi to the userdb to get the userId and walletId
    const {upi , amount , idempotencyKey} = req.body;

    const user: UserResponse|null = await getUserInfo(upi);

    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    if (!amount || !user.userId || !user.walletId || !idempotencyKey) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    console.log(`${amount} Withdraw request received for user ${user.userId} and wallet ${user.walletId}`);
    // L
    res.status(200).json({ message: "WithDraw request is being processed" });
    try {
        await processWithdraw(idempotencyKey, user.userId, amount , PaymentType.WITHDRAWAL);
    } catch (error) {
        
    }
}

