import { prisma } from "../db";
export async function isExistingUser(searchParameter: string){
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: searchParameter },
          { phone: searchParameter }
        ],
      },
    });
    return user;
  }
  