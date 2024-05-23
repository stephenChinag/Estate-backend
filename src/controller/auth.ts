import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { UserDocument } from "../model/user";
import Jwt from "jsonwebtoken";

export const registerController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  let existingUser;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser: UserDocument = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Creating user failed Please try again" });
    }

    // const token = Jwt.sign(
    //   { userId: newUser._id, email: newUser.email },
    //   "your_secret_key",
    //   { expiresIn: "1h" }
    // );
    // Set custom headers
    // res.set({
    //   Authorization: `Bearer ${token}`,
    //   "X-Custom-Header": "Custom header value",
    // });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error register user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user;
  try {
    // IF A USER EXIST
    user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "incorrect email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "IncorrectPassword" });
    }
    const token = Jwt.sign(
      { userId: user._id, email: user.email },
      "your_secret_key",
      { expiresIn: "1h" } // Token expires in 1 hour
    );
    // CHECK IF THE PASSWORD MATCH
    // GENERATE COOKIE TOKEN AND SEND TO THE USER

    res.status(200).json({ message: "Login succesfully", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const logoutController = (req: Request, res: Response): void => {
  res.json({ message: "LogOut" });
};
