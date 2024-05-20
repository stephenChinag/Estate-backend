import { Request, Response } from "express";

export const createPost = (req: Request, res: Response) => {
  res.json({ message: "it works" });
};

export const getAllPost = (req: Request, res: Response) => {
  console.log("All Post");
  res.json({ message: "Dante" });
};
