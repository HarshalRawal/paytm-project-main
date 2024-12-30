import express, { Request, Response } from 'express';
import cors from 'cors'; // Import the CORS package
import axios from 'axios';
import Redis from 'ioredis';
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

import { PrismaClient } from '@prisma/client';
import cookieParse from 'cookie-parser';

import { GenerateToken } from './utils/generateToken';
import { logout } from './utils/logout';
import { cookieMiddleware } from './utils/middleware';

const prisma = new PrismaClient();
const app = express();
const redis = new Redis(); // Defaults to localhost:6379



// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Change this to your frontend origin
  credentials: true // Allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParse());

app.post('/logout', logout);

app.post('/new-user', async (req: Request, res: any) => {
  const { name, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone },
    });

    let walletId;
    try {
      const newWalletResponse = await axios.post<string>(
        'http://localhost:8086/create-wallet',
        { userId: newUser.userId }
      );
      walletId = newWalletResponse.data;
    } catch (walletError) {
      console.error('Error creating wallet:', walletError);
      return res.status(500).json({ error: 'Error creating wallet' });
    }

    const updatedUser = await prisma.user.update({
      where: { userId: newUser.userId },
      data: { walletId },
    });

    // Generate sessionId
    const sessionId = uuidv4();
    console.log("Session Id generated : " , sessionId)

    // Store sessionId in Redis
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({ userId: newUser.userId, walletId }),
      'EX',
      3600 // Set expiration time in seconds (1 hour)
    );

    // Set sessionId in an httpOnly cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({ updatedUser, message: 'User signup successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user after creating the walletID' });
  }
});



app.post('/signin', async (req: Request, res: any) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare entered password with the stored hashed password
    console.log("password : " , password , " UserPassword : " , user.password)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate sessionId
    const sessionId = uuidv4();
    console.log("Session Id generated: ", sessionId);

    // Store sessionId in Redis
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({ userId: user.userId, walletId: user.walletId }),
      'EX',
      3600 // Set expiration time in seconds (1 hour)
    );

    // Set sessionId in an httpOnly cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ user, message: 'User signed in successfully' });
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ error: 'Error signing in user' });
  }
});


app.post('/logout', async (req: Request, res: any) => {
  try {
    // Get sessionId from the cookie
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return res.status(400).json({ error: 'No session found' });
    }

    // Remove sessionId from Redis
    await redis.del(`session:${sessionId}`);

    // Clear the session cookie
    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ error: 'Error logging out user' });
  }
});

app.post('/check', cookieMiddleware, async (req: Request, res: Response) => {
  res.send('hello from the check request');
});

app.listen(6001, () => {
  console.log('Server running  on port 6001');
});


