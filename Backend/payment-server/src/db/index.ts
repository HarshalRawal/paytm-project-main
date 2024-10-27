import { PrismaClient } from "@prisma/client"
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const prisma = globalForPrisma.prisma || new PrismaClient()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma


export async function connectDB(){
    try {
        await prisma.$connect();
        console.log("Connected to the Database");
    } catch (error) {
        console.error("Error connecting to the Database", error);
        process.exit(1);
    }
}

export async function disconnectDB(){
    try {
        await prisma.$disconnect();
        console.log("Disconnected from the Database");
    } catch (error) {
        console.error("Error disconnecting from the Database", error);
        process.exit(1);
    }
}
