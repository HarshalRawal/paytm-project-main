import { Request, Response } from 'express';
import {  processWithdraw } from '../utils/processPayment';
import { PaymentType } from '@prisma/client';
export const withDrawController = async(req: Request, res: Response) => {
    console.log("Received withdraw request");
    const { amount, userId ,walletId,idempotencyKey} = req.body;
    if (!amount || !userId || !walletId || !idempotencyKey) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    console.log(`${amount} Withdraw request received for user ${userId} and wallet ${walletId}`);
    // L
    res.status(200).json({ message: "WithDraw request is being processed" });
    try {
        await processWithdraw(idempotencyKey, userId, amount , PaymentType.WITHDRAWAL);
    } catch (error) {
        
    }
}