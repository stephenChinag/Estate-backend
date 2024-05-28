import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not Authenticated" });
  }
  Jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as string,

    async (err: any, payload: any) => {
      if (err) return res.status(403).json({ message: "Token is not Valid" });

      req.userId = payload.userId;
      next();
    }
  );
};
