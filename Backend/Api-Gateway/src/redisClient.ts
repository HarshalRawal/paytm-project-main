import { Response } from "express";
import { createClient,RedisClientType } from "redis";

let redisClient: RedisClientType;

export async function initRedisClient():Promise<RedisClientType>{
   if(!redisClient){
     redisClient = createClient({
        url: process.env.REDIS_URL
     });
     redisClient.on("error",(err)=>{
        console.error("Error in Redis Client: ",err);
     })
     await redisClient.connect();
     console.log("Redis Client Connected");
   }
   return redisClient;
}
export async function get(key:string):Promise<string|null>{
    const client = await initRedisClient();
    return await client.get(key);
}
 export async function storeIdempotencyKey(idempotencyKey:string):Promise<void>{
    const client = await initRedisClient();
    const interiumResponse = {
        status: "processing",
        message: "Request is being processed",
        createdAt: new Date().toISOString()
    }
    await client.hSet(idempotencyKey,{
        status:interiumResponse.status,
        response: JSON.stringify(interiumResponse),
        createdAt: interiumResponse.createdAt
    });
    await client.expire(idempotencyKey, 60);
} 

 export async function getIdempotencyResponse(idempotencyKey:string):Promise<string|undefined>{
    const client = await initRedisClient();
    const response = await client.hGet(idempotencyKey,"response");
        if(response){
        return JSON.parse(response);
      }

}
export async function updateIdempotencyKey(idempotencyKey: string, res: Response): Promise<void> {
    try {
      // Initialize Redis client
      const client = await initRedisClient();
  
      // Serialize the response into a JSON string
      const serializedResponse = JSON.stringify({
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        body: res.json,
      });
      await client.hSet(idempotencyKey,{
        status:res.statusMessage,
        interiumResponse: serializedResponse,
        updatedAt: new Date().toISOString() 
      });
      await  client.expire(idempotencyKey,1000);
  
      console.log(`Idempotency key '${idempotencyKey}' successfully updated in Redis.`);
    } catch (error) {
      console.error('Error updating idempotency key in Redis:', error);
      throw new Error('Failed to update idempotency key in Redis');
}
}
    
export async function idempotencyKeyExists(idempotencyKey:string):Promise<boolean>{
    const client = await initRedisClient();
    return await client.exists(idempotencyKey) === 1;
 }  
