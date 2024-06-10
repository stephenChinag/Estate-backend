import express from "express";
import {
  getPost,
  getAllPosts,
  deletePost,
  addPost,
  updatePost,
} from "../controller/post";
import { verifyToken } from "../middleware/verifytoken";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
export default router;
