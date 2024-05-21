import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./router/auth";
import postRouter from "./router/post";

const app = express();

dotenv.config();
// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// Connect to MongoDB

// Mount routers
app.use(authRouter);
app.use(postRouter);

const PORT = process.env.PORT || 7000;

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
