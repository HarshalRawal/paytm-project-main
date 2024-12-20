import { NextFunction, Request, Response } from "express";
import { idempotencyKeyExists } from "../redis/redisClient";
import { getIdempotencyResponse } from "../redis/redisClient";
import { storeIdempotencyKey } from "../redis/redisClient";
export async function idempotencyMiddleware(req:Request,res:Response,next:NextFunction):Promise<void>{
   console.log("request received in idempotency middleware");
    const idempotencyKey = req.headers["idempotency-key"];
    console.log(idempotencyKey);
    if (!idempotencyKey) {
     res.status(400).json({error:"Idempotency key is required"})
     return;
    }
  try {
    const keyExists = await idempotencyKeyExists(idempotencyKey as string);
    if(keyExists){
        const cashedResponse = await getIdempotencyResponse(idempotencyKey as string);
        res.status(200).json(cashedResponse);
        return;
    }
    await storeIdempotencyKey(idempotencyKey as string);
    next();
  } catch (error) {
    console.error("Error in idempotencyMiddleware: ",error);
    res.status(500).json({error:"Internal Server Error"});
  }
}