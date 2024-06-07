import { Request, Response } from "express";
import Post from "../model/post"; // Assuming the Post model is in models/post.ts

// Get all posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post by ID
export const getPost = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new post
export const addPost = async (req: Request, res: Response) => {
  const tokenUserId = req.userId;

  const {
    title,
    img,
    bedroom,
    bathroom,
    price,
    address,
    latitude,
    longitude,
    type,
    property,
    userId,
  } = req.body;
  const newPost = new Post({
    title,
    img,
    bedroom,
    bathroom,
    price,
    address,
    latitude,
    longitude,
    type,
    property,
    userId: tokenUserId,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }

    if (post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Unautorized action" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
