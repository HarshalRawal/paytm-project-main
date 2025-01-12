import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with your actual secret or environment variable

/**
 * Middleware for JWT authentication.
 */

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  console.log(`authHeader: ${authHeader}`);

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' });
    return;
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token missing in Authorization header' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { [key: string]: any }; // Decode token
    console.log('Decoded token:', decoded);

    next(); // Proceed to the next middleware
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default authenticateJWT;