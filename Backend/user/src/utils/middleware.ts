import { NextFunction , Request , Response} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = "easyPay";

export const cookieMiddleware = (req: any, res: any, next: any) => {
    console.log("cookieMiddleware called");
    
  const token = req.cookies.auth_token;
  console.log(token);
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; 
    req.userId != decoded.id
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};