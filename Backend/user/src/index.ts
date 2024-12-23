import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cookieParse from 'cookie-parser';
import axios from 'axios';
import cors from 'cors'; // Import the CORS package

import { GenerateToken } from './functions/generateToken';
import { logout } from './functions/logout';
import { cookieMiddleware } from './functions/middleware';

const prisma = new PrismaClient();
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Change this to your frontend origin
  credentials: true // Allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParse());

app.post('/logout', logout);

app.post('/new-user', async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { name, email, password, phone },
    });

    const newWalletResponse = await axios.post<string>(
      'http://localhost:8086/create-wallet',
      { userId: newUser.userId }
    );

    const walletId = newWalletResponse.data;

    const updatedUser = await prisma.user.update({
      where: { userId: newUser.userId },
      data: { walletId },
    });

    const token = GenerateToken(newUser.userId);

    res.cookie('auth_token', token);
    console.log(token);
    
    res.status(201).json({ updatedUser, mssg: 'User signup successfully' });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/signin', async (req: any, res: any) => {
  const { email, password } = req.body;
  const incomingUser = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!incomingUser) {
    return res.status(404).json({ mssg: 'User does not exist!! Please SignUp' });
  }

  if (incomingUser.password !== password) {
    return res.status(400).json({ mssg: 'Incorrect Password ' });
  }

  const token = GenerateToken(incomingUser.userId);

  res.cookie('auth_token', token);
  console.log(token);
  
  res.status(200).send('User signIn successfully');
});

app.post('/check', cookieMiddleware, async (req: Request, res: Response) => {
  res.send('hello from the check request');
});

app.listen(6001, () => {
  console.log('Server running  on port 6001');
});