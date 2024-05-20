import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./router/auth";
import postRouter from "./router/post";

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// Connect to MongoDB

// Mount routers
app.use("/auth", authRouter);
app.use("/posts", postRouter);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
