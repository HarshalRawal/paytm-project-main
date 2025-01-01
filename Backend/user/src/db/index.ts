import { PrismaClient } from "@prisma/client"
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const prisma = globalForPrisma.prisma || new PrismaClient()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma


export async function connectDb(){
    try{
        await prisma.$connect();
        console.log("Connected to the database");
    }
    catch(error){
        console.error("Error connecting to the database", error);
        process.exit(1);
    }
}

export async function disconnectDb(){
    try{
        await prisma.$disconnect();
        console.log("Disconnected from the database");
    }
    catch(error){
        console.error("Error disconnecting from the database", error);
        process.exit(1);
    }
}