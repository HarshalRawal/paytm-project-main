import { prisma } from "../db";

export async function isExistingUser(searchParameter: string) {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: searchParameter },
                { phone: searchParameter }
            ],
        },
    });

    // Return an object with the user's properties
    if (user) {
        return {
            createdAt: user.createdAt,
            email: user.email,
            id: user.id,
            phone: user.phone,
            updatedAt: user.updatedAt,
            username: user.username,
            walletId: user.walletId,
            hashedPin: user.hashedPin,
            profilePicture: user.profilePicture,
            passwordHash: user.passwordHash,
            name: user.name,
        };
    }
    // Return null or an empty object if no user is found
    return {message: "User not found"};
}
