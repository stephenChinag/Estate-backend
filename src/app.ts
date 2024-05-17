import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import postRouter from "./router/post";

//setting connection string
// mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
//   console.log("Connected to database");
// });

const app = express();

app.use(express.json());

app.use(cors());

app.use("/test", postRouter);
// test route on that

app.listen(7000, () => {
  console.log("listening to port 7000");
});
//
