import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(express.json());

app.use(cors());

// test route on that
app.get("/test", async (req: Request, res: Response) => {
  res.json({ message: "Hello" });
});
// an
app.listen(4000, () => {
  console.log("listening to port 4000");
});
