import express, { Request, Response } from 'express';
import cors from 'cors'; // Import the CORS package
import axios from 'axios';
import Redis from 'ioredis';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { connectDb, disconnectDb } from './db/index';
import { PrismaClient } from '@prisma/client';
import cookieParse from 'cookie-parser';
import { prisma } from './db/index';
import { GenerateToken } from './utils/generateToken';
import { logout } from './utils/logout';
// import { cookieMiddleware } from './utils/middleware';
import { isExistingUser } from './utils/isExistingUser';
import { addContact } from './utils/addContact';
import { getContacts } from './utils/getContacts';
import getSessionDataFromToken from './utils/getSessionDataFromToken';

const app = express();
const redis = new Redis(); // Defaults to localhost:6379
const JWT_SECRET = 'your-secret-key';


// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','Idempotency-Key'],
}));
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

app.post('/new-user', async (req: Request, res: any) => {
  console.log("Sign Up request received");
  const { name, email, password, phone } = req.body;

  try {
    // const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { name, email, passwordHash: password, phone },
    });

    let walletId;
    try {
      const newWalletResponse = await axios.post<string>(
        'http://localhost:8086/create-wallet',
        { userId: newUser.id }
      );
      walletId = newWalletResponse.data;
    } catch (walletError) {
      console.error('Error creating wallet:', walletError);
      return res.status(500).json({ error: 'Error creating wallet' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: newUser.id },
      data: { walletId },
    });

    console.log(" userId :  " , newUser.id);
    console.log(" walletId : " , walletId);
    // Create JWT token
    const userid = newUser.id
    const token = jwt.sign({ userid , walletId  }, JWT_SECRET, { expiresIn: '1h' });
    console.log("SignUp token : " , token)

    res.status(201).json({ token, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});



app.post('/signin', async (req: Request, res: any) => {
  console.log("Sign In request received");
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    const isPasswordValid = password
    if (isPasswordValid != user.passwordHash) {
      return res.status(401).json({ error: 'Invalid password' });
    }


    // Create JWT token
    console.log("UserId : " ,user.id);
    console.log("WalletId : " ,user.walletId);
    const token = jwt.sign({ userId : user.id , walletId : user.walletId }, JWT_SECRET, { expiresIn: '1h' });
    console.log("SignIn token : " ,token)

    res.status(200).json({ token, message: 'User signed in successfully' });
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ error: 'Error signing in user' });
  }
});

app.post('/logout', async (req: Request, res: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; walletId: string };
    const { userId, walletId } = decoded as { userId: string; walletId: string };

   
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ error: 'Error logging out user' });
  }
});


app.get('/check', async (req: Request, res: any) => {

  console.log("Reached check route")
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing in Authorization header' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded Token(from /check):', decoded);

    // Extract userId and walletId from the decoded token
    const { userId, walletId } = decoded as { userId: string; walletId: string };

    if (!userId || !walletId) {
      return res.status(400).json({ error: 'Invalid token payload: userId or walletId missing' });
    }

    // Respond with the extracted data
    res.status(200).json({ message: 'Authorized', userId, walletId });
  } catch (error) {
    console.error('Invalid token or error in processing:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});


app.post('/is-user', async (req, res) => {
  const { searchParameter } = req.body;
  console.log(`Checking if ${searchParameter} exists`);
  try {
    const existingUser = await isExistingUser(searchParameter);
    console.log(`Response from user service: ${existingUser}`);
    res.status(200).json({ existingUser });
    return;
  } catch (error) {
    console.error(`Error checking if ${searchParameter} exists: ${error}`);
    res.status(500).send({ error: `Error checking if ${searchParameter} exists: ${error}` });
    return;
  }
});
app.post('/addContact', async (req, res) => {
  console.log("Add contact request received");
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

app.get("/getHashedPin", async (req, res) => {
  const { userId } = req.query;
  console.log(`Fetching hashed PIN from API for walletId: ${userId}`);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: { hashedPin: true },
    })
    if(!user){
       res.status(404).json({ error: `User ${userId} not found` });
       return;
    }
    res.status(200).json({hashedPin:user.hashedPin} );
  } catch (error) {
    console.error('Error getting hashed pin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})




