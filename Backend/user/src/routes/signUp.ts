// import { Request, Response, RequestHandler } from 'express';
// import axios from 'axios';
// import Redis from 'ioredis';
// import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const redis = new Redis();

// export const signup: RequestHandler = async (req: Request, res: Response) => {
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

//     const sessionId = uuidv4();

//     await redis.set(
//       `session:${sessionId}`,
//       JSON.stringify({ userId: newUser.userId, walletId }),
//       'EX',
//       3600
//     );

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
// };