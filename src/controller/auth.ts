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

  try {
    // Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = Jwt.sign(
      { userId: existingUser.id, email: existingUser.email, isAdmin: true },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    // Set HTTP-only cookie with the token
    res.cookie("token", token, {
      httpOnly: true,
      // Other cookie options (e.g., secure, domain, etc.) can be added here
    });

    // Return user info and token
    res.json({
      userId: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
      avatar: existingUser.avatar,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const logoutController = (req: Request, res: Response): void => {
  res.clearCookie("token").status(200).json({ message: "logout succesfull" });
};
