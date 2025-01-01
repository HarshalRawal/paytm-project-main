
import { prisma } from "../db";

export async function addContact(contactUsername: string, userId: string) {
    // Check if the user exists by username
    const user = await prisma.user.findUnique({
        where: {
            username: contactUsername,
        },
    });
    if (!user) {
        return { error: `User ${contactUsername} not found` };
    }
    // Check if the contact is already in the user's contact list
    const existingUser = await prisma.contact.findFirst({
        where: {
            userId: userId,
            contactId: user.id,
        },
    });
    if (existingUser) {
        return { error: `User ${contactUsername} is already in your contact list` };
    }

    // Add the new contact
    await prisma.contact.create({
        data: {
            userId: userId,
            contactId: user.id,
        },
    });

    // Return the added contact details
    const addedContact = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            id: true,
            name: true,
            username: true,
            phone: true,
            profilePicture: true,
        },
    });
    return addedContact;
}
