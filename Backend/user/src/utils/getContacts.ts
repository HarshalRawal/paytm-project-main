import { prisma } from "../db";
export async function getContacts(userId: string) {
    try {
      // Fetch the contacts for the given userId
      const contacts = await prisma.contact.findMany({
        where: { userId: userId },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
              username: true,
              phone: true,
              profilePicture: true,
            },
          },
        },
      });
  
      // Return the contacts data
      return contacts.map(contact => ({
        id: contact.contact.id,
        name: contact.contact.name,
        username: contact.contact.username,
        phone : contact.contact.phone,
        profilePicture: contact.contact.profilePicture,
      }));
    } catch (error) {
      // Log the error and return an empty array or an error message
      console.error('Failed to fetch contacts:', error);
      return [];
    }
  }
  