import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cookieParse from 'cookie-parser';
import axios from 'axios';
import cors from 'cors'; // Import the CORS package

import { GenerateToken } from './utils/generateToken';
import { logout } from './utils/logout';
import { cookieMiddleware } from './utils/middleware';
import { validateAndExtractNumber } from './utils/extractNumber';

interface UserResponse{
  phone : string;
  userId : string;
  walletId : string;
  upi : string;
}
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

app.post('/new-user', async (req: Request, res: any) => {
  const { name, email, password, phone } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { name, email, password, phone },
    });

    let walletId: string;

    try {
      const newWalletResponse = await axios.post<string>(
        'http://localhost:8086/create-wallet',
        { userId: newUser.userId }
      );
      walletId = newWalletResponse.data;
    } catch (error) {
      console.error('Error creating wallet:', error);
      return res.status(500).json({ error: 'Failed to create wallet' });
    }

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

app.post('/signin', async (req: Request, res: any) => {
  const { email, password } = req.body;

  try {
    const incomingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!incomingUser) {
      return res.status(404).json({ mssg: 'User does not exist! Please sign up.' });
    }

    if (incomingUser.password !== password) {
      return res.status(400).json({ mssg: 'Incorrect password' });
    }

    const token = GenerateToken(incomingUser.userId);

    res.cookie('auth_token', token);
    console.log(token);

    res.status(200).send('User sign-in successful');
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Error signing in' });
  }
});


app.post("/get-user", async (req: Request, res: any) => {
  console.log("Requested to get the userInfo ")
  const { upi } = req.body;

  try {
    const phone = validateAndExtractNumber(upi);

    if (!phone) {
      console.error("UPI is invalid or wrong.");
      return res.status(400).json({ error: "Invalid UPI format." });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { phone },
      });

      if (!user || !user.userId || !user.walletId || !user.phone) {
        console.error(
          "Missing some data: ",
          { user },
          " userId: ",
          user?.userId,
          " walletId: ",
          user?.walletId,
          " phone: ",
          user?.phone
        );
        return res.status(404).json({ error: "User not found or incomplete data." });
      }

      const response: UserResponse = {
        phone: user.phone,
        userId: user.userId,
        walletId: user.walletId,
        upi: upi,
      };

      console.dir(response , {depth :null , colors : true})

      res.status(200).json(response);
    } catch (error) {
      console.error("Error querying user from database:", error);
      res.status(500).json({ error: "Internal server error while fetching user." });
    }
  } catch (error) {
    console.error("Error processing UPI:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post('/check', cookieMiddleware, async (req: Request, res: Response) => {
  try {
    res.send('Hello from the check request');
  } catch (error) {
    console.error('Error processing check request:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

app.listen(6001, () => {
  console.log('Server running  on port 6001');
});