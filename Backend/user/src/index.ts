import express, { Request, Response } from 'express';
import cors from 'cors'; // Import the CORS package
import axios from 'axios';
import Redis from 'ioredis';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { connectDb, disconnectDb } from './db/index';
import { PrismaClient } from '@prisma/client';
import cookieParse from 'cookie-parser';

import { GenerateToken } from './utils/generateToken';
import { logout } from './utils/logout';
import { cookieMiddleware } from './utils/middleware';
import { isExistingUser } from './utils/isExistingUser';
import { addContact } from './utils/addContact';
import { getContacts } from './utils/getContacts';

const prisma = new PrismaClient();
const app = express();
// const redis = new Redis(); // Defaults to localhost:6379



// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(cookieParse());


async function start() {
  try {
      await connectDb();
      app.listen(6001, () => {
        console.log('Server running  on port 6001');
      });
  } catch (error) {
      console.error("Error starting the service:", error);
      process.exit(1); // Exit if unable to start
  }
}

process.on('SIGINT', async () => {
  console.log("Shutting down gracefully...");
  try { // Disconnect Kafka
      await disconnectDb(); // Disconnect Database
      console.log("Disconnected from Kafka and Database");
  } catch (error) {
      console.error("Error during shutdown:", error);
  } finally {
      process.exit(0); // Exit process
  }
});

start();
// app.post('/logout', logout);

// app.post('/new-user', async (req: Request, res: any) => {
//   const { name, email, password, phone } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 12);

//     const newUser = await prisma.user.create({
//       data: { name, email, password: hashedPassword, phone },
//     });

//     let walletId;
//     try {
//       const newWalletResponse = await axios.post<string>(
//         'http://localhost:8086/create-wallet',
//         { userId: newUser.userId }
//       );
//       walletId = newWalletResponse.data;
//     } catch (walletError) {
//       console.error('Error creating wallet:', walletError);
//       return res.status(500).json({ error: 'Error creating wallet' });
//     }

//     const updatedUser = await prisma.user.update({
//       where: { userId: newUser.userId },
//       data: { walletId },
//     });

//     // Generate sessionId
//     const sessionId = uuidv4();
//     console.log("Session Id generated : " , sessionId)

//     // Store sessionId in Redis
//     await redis.set(
//       `session:${sessionId}`,
//       JSON.stringify({ userId: newUser.userId, walletId }),
//       'EX',
//       3600 // Set expiration time in seconds (1 hour)
//     );

//     // Set sessionId in an httpOnly cookie
//     res.cookie('sessionId', sessionId, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//     });

//     res.status(201).json({ updatedUser, message: 'User signup successfully' });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ error: 'Error creating user after creating the walletID' });
//   }
// });



// app.post('/signin', async (req: Request, res: any) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(400).json({ error: 'User not found' });
//     }

//     // Compare entered password with the stored hashed password
//     console.log("password : " , password , " UserPassword : " , user.password)
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }

//     // Generate sessionId
//     const sessionId = uuidv4();
//     console.log("Session Id generated: ", sessionId);

//     // Store sessionId in Redis
//     await redis.set(
//       `session:${sessionId}`,
//       JSON.stringify({ userId: user.userId, walletId: user.walletId }),
//       'EX',
//       3600 // Set expiration time in seconds (1 hour)
//     );

//     // Set sessionId in an httpOnly cookie
//     res.cookie('sessionId', sessionId, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//     });

//     res.status(200).json({ user, message: 'User signed in successfully' });
//   } catch (error) {
//     console.error('Error signing in user:', error);
//     res.status(500).json({ error: 'Error signing in user' });
//   }
// });


// app.post('/logout', async (req: Request, res: any) => {
//   try {
//     // Get sessionId from the cookie
//     const sessionId = req.cookies.sessionId;

//     if (!sessionId) {
//       return res.status(400).json({ error: 'No session found' });
//     }

//     // Remove sessionId from Redis
//     await redis.del(`session:${sessionId}`);

//     // Clear the session cookie
//     res.clearCookie('sessionId', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//     });

//     res.status(200).json({ message: 'User logged out successfully' });
//   } catch (error) {
//     console.error('Error logging out user:', error);
//     res.status(500).json({ error: 'Error logging out user' });
//   }
// });

// app.post('/check', cookieMiddleware, async (req: Request, res: Response) => {
//   res.send('hello from the check request');
// });


app.post('/is-user', async (req, res) => {
  const { searchParameter } = req.body;
  console.log(`Checking if ${searchParameter} exists`);
  try {
    const existingUser = await isExistingUser(searchParameter);
    console.log(`Response from user service: ${(existingUser)}`);
    res.status(200).json({ existingUser });
    return;
  } catch (error) {
    console.error(`Error checking if ${searchParameter} exists: ${error}`);
    res.status(500).send({ error: `Error checking if ${searchParameter} exists: ${error}` });
    return;
  }
});
app.post('/addContact', async (req, res) => {
  const {contactUsername,userId} = req.body;
  try {
    const response = await addContact(contactUsername,userId);
    console.log(`Contact added: ${JSON.stringify(response)}`);
    res.status(200).json(response);
  } catch (error) {
    console.error(`Error adding contact: ${error}`);
    res.status(500).send({ error: 'Internal server error' });
  }
})
app.get('/getContact', async (req, res) => {
  const userId = req.query.userId as string;

  // Validate if userId is provided
  if (!userId) {
    res.status(400).json({ error: 'Missing userId query parameter' });
    return;
  }

  try {
    // Call the getContacts function to fetch the contacts
    const contacts = await getContacts(userId);

    // If no contacts are found, return a 404 response
    if (contacts.length === 0) {
       res.status(404).json({ message: 'No contacts found for this user' });
       return;
    }

    // Return the contacts data with a 200 status
    res.status(200).json(contacts);
    return;
  } catch (error) {
    // Log the error and send a 500 internal server error response
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
    return;
  }
});




