import { Request, Response } from "express";
import User from "../model/user";

export const getUsers = async (req: Request, res: Response) => {
  console.log("it worked ");
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Failed to get all Users" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Failed to get User" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Failed to Update User" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Failed to delete User" });
  }
};
