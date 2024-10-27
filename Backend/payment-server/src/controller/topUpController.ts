import { Request, Response } from 'express';
import { processPayment } from '../utils/processPayment';
export const topUpController = async(req: Request, res: Response) => {
    console.log("Received top-up request");
    const { amount, userId ,walletId,idempotencyKey} = req.body;
    if (!amount || !userId || !walletId || !idempotencyKey) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    console.log(`${amount} top-up request received for user ${userId} and wallet ${walletId}`);
    // L
    res.status(200).json({ message: "top-up request is being processed" });
    try {
        await processPayment(idempotencyKey, userId, amount);
    } catch (error) {
        
    }
}