import { Request, Response } from "express";
import User from "../model/user";
import bcrypt from "bcrypt";

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
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { avatar, password, ...input } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user._id.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt
      user.password = hashedPassword; // Update the user's password
    }

    if (avatar && avatar !== user.avatar) {
      user.avatar = avatar;
    }

    user.set(input);
    await user.save();
    return res.status(200).json({ message: "User Upddated Succesfully", user });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Failed to Update User" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(400).json({ message: "Not Authorised " });
  }
  try {
    const deletedUser = await User.deleteOne({ _id: id });
    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Failed to delete User" });
  }
};
