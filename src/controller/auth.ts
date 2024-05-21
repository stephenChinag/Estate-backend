import { Request, Response } from "express";

export const registerConroller = (req: Request, res: Response): void => {
  const { username, email, password } = req.body;
  console.log(req.body);
};

export const loginController = (req: Request, res: Response): void => {
  res.json({ message: "Login" });
};

export const logoutController = (req: Request, res: Response): void => {
  res.json({ message: "LogOut" });
};
