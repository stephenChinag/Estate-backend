import { Request, Response } from "express";
import Post from "../model/post"; // Assuming the Post model is in models/post.ts
import { Types } from "mongoose";
import PostDetail from "../model/postdetails";

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
export const addPost = async (req: Request, res: Response): Promise<void> => {
  const tokenUserId = req.userId;

  const {
    title,
    price,
    img,
    address,
    city,
    bedroom,
    bathroom,
    type,
    property,
    latitude,
    longitude,
    postDetail, // Expecting postDetail as an object
  } = req.body;

  // Create a new PostDetail instance if postDetail is provided
  let newPostDetail;
  if (postDetail) {
    newPostDetail = new PostDetail(postDetail);
  }

  // Create a new Post instance
  const newPost = new Post({
    title,
    img,
    bedroom,
    bathroom,
    price,
    city,
    address,
    latitude,
    longitude,
    type,
    property,
    userId: tokenUserId,
    postDetail: newPostDetail?._id, // Reference to PostDetail document's ObjectId
  });

  try {
    // Save the post detail first if it exists
    if (newPostDetail) {
      await newPostDetail.save();
    }

    // Save the main post
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to create post" });
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

  // Validate the ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid post ID format" });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
