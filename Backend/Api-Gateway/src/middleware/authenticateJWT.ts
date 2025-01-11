import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with your actual secret or environment variable

/**
 * Middleware for JWT authentication.
 */


export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  console.log(`authHeader: ${authHeader}`);
  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return 
  }

  const token = authHeader.split(" ")[1];
   next();
  // try {
  //   const decoded = jwt.verify(token, JWT_SECRET); // Replace with your secret
  //   // req.user = decoded; // Attach decoded token data to `req.user`
  //   next(); // Proceed to the next middleware
  // } catch (err) {
  //   res.status(403).json({ message: "Invalid or expired token" });
  // }
};

export default authenticateJWT;