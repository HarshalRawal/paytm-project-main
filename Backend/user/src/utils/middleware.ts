import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return 
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret"); // Replace with your secret
    // req.user = decoded; // Attach decoded token data to `req.user`
    next(); // Proceed to the next middleware
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};