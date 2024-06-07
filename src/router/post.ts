import express from "express";
import {
  getPost,
  getPosts,
  deletePost,
  addPost,
  updatePost,
} from "../controller/post";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/:id", addPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
export default router;
