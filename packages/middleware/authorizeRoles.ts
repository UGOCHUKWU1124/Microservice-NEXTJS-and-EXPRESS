import { NextFunction, Request, Response } from "express";
import { AuthError } from "../error-handler";

declare global {
  namespace Express {
    interface Request {
      role?: string;
    }
  }
}


export const isSeller = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== "seller") throw new AuthError("Access denied: Seller only");
  next();
};

export const isUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== "user") throw new AuthError("Access denied: User only");
  next();
};