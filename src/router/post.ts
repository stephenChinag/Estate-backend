import express from "express";
import { createPost, getAllPost } from "../controller/post";

const router = express.Router();

router.post("/", createPost);
router.get("/allPost", getAllPost);
export default router;
