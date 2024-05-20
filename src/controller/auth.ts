import { Request, Response } from "express";

export const signup = (req: Request, res: Response): void => {
  res.json({ message: "Register" });
};

export const login = (req: Request, res: Response): void => {
  res.json({ message: "Login" });
};

export const logout = (req: Request, res: Response): void => {
  res.json({ message: "LogOut" });
};
