import express, { Request, Response } from "express";
import Jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req: Request, res: Response) => {
  console.log("should be logged In Id ", req.userId);
  res.status(200).json({ message: "you are authenticated" });
};

export const shouldBeAdmin = (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not Autenticated" });
  }

  Jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as string,
    async (err: any, payload: any) => {
      if (err) return res.status(403).json({ message: "Token is Valid" });

      if (!payload.isAdmin)
        return res.status(401).json({ message: "Not  Authorized" });
    }
  );

  res.status(200).json({ message: "you are authenticated" });
};
