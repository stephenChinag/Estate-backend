import express from "express";
import { createPost, getAllPost } from "../controller/post";

const router = express.Router();

router.post("/createpost", createPost);
router.get("/allpost", getAllPost);
export default router;
