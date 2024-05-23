import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { UserDocument } from "../model/user";
import Jwt from "jsonwebtoken";

export const registerController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: UserDocument = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
    } catch (err) {
      res.status(500).json({ error: "Creating user failed Please try again" });
    }

    const token = Jwt.sign(
      { userId: newUser._id, email: newUser.email },
      "your_secret_key",
      { expiresIn: "1h" }
    );
    // Set custom headers
    res.set({
      Authorization: `Bearer ${token}`,
      "X-Custom-Header": "Custom header value",
    });
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Error register user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginController = (req: Request, res: Response): void => {
  res.json({ message: "Login" });
};

export const logoutController = (req: Request, res: Response): void => {
  res.json({ message: "LogOut" });
};
