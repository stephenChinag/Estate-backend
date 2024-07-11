import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./router/auth";
import postRouter from "./router/post";
import testRoute from "./router/test";
import userRoute from "./router/user";

const app = express();

dotenv.config();
// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors({ origin: process.env.CLIENT_URL as string, credentials: true }));

// Middleware to parse Cookies
app.use(cookieParser());

// Mount routers
app.use("/api/auth", authRouter);
app.use("/api/users", userRoute);
app.use("/api/posts", postRouter);
app.use("/api/test", testRoute);

const PORT = process.env.PORT || 7000;

mongoose.connect(process.env.DATABASE_URL as string).then(() => {
  console.log("connecting...");
  app.listen(PORT, () => {
    console.log(`Listen to port ${PORT}`);
  });
});
