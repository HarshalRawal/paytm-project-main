import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with your actual secret or environment variable

/**
 * Middleware for JWT authentication.
 */

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  console.log("Received token for check");

  // Normalize header key to lowercase to handle case sensitivity
  const authHeader = req.headers["authorization"]; 
  console.log("Authorization header :- ", authHeader);

  // Ensure authHeader is a string
  if (!authHeader || typeof authHeader !== "string") {
    console.log("Request reached if !authHeader section");
    res.status(401).json({ message: "Authorization header missing or invalid" });
    return 
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Replace with your secret
    console.log("Decoded token:", decoded);

    // Attach decoded token to request object if needed
    // req.user = decoded; 

    next(); // Proceed to the next middleware
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authenticateJWT;