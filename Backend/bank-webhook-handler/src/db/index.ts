import { PrismaClient } from "@prisma/client"
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const prisma = globalForPrisma.prisma || new PrismaClient()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma



export async function connectDB(){
    try {
        await prisma.$connect();
        console.log("Successfully connected to database");
    } catch (error) {
        console.error("Error Connecting to database");
        process.exit(1);
    }
}

export async function disconnectDB(){
   try {
        await prisma.$disconnect();
        console.log(`Successfully disconnected from database`);
   } catch (error) {
      console.error("Error disconnecting from database");
      process.exit(1);
   }
}