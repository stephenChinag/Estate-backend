import express from "express";
import {
  getPost,
  getPosts,
  deletePost,
  addPost,
  updatePost,
  savePost,
} from "../controller/post";
import { verifyToken } from "../middleware/verifytoken";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.post("/save", verifyToken, savePost);
export default router;
