import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const registerController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(username, email, password);
  console.log(hashedPassword);
};

export const loginController = (req: Request, res: Response): void => {
  res.json({ message: "Login" });
};

export const logoutController = (req: Request, res: Response): void => {
  res.json({ message: "LogOut" });
};
