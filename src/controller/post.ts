import { Request, Response } from "express";
import Post from "../model/post"; // Assuming the Post model is in models/post.ts
import mongoose, { Types } from "mongoose";
import PostDetail from "../model/postdetails";

// Get all posts
export const getAllPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const posts: any = await Post.find().populate("postDetail").exec();
    res.status(200).json(posts);
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: error.message });
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
    images,
    address,
    city,
    bedroom,
    bathroom,
    latitude,
    longitude,
    type,
    property,
    postDetail,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !price ||
    !images ||
    !address ||
    !city ||
    !bedroom ||
    !bathroom ||
    !latitude ||
    !longitude ||
    !type ||
    !property
  ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  // Start a session to ensure atomic operations
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create a new Post instance
    const newPost = new Post({
      title,
      price,
      images,
      address,
      city,
      bedroom,
      bathroom,
      latitude,
      longitude,
      type,
      property,
      userId: tokenUserId,
    });

    // Save the main post
    const savedPost = await newPost.save({ session });

    // If postDetail is provided, create a new PostDetail instance
    if (postDetail) {
      const newPostDetail = new PostDetail({
        ...postDetail,
        postId: savedPost._id, // Set the postId to the saved post's _id
      });
      await newPostDetail.save({ session });

      // Update the post with the postDetail reference
      savedPost.postDetail = newPostDetail._id;
      await savedPost.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    // Populate the postDetail field in the savedPost
    const populatedPost = await Post.findById(savedPost._id)
      .populate("postDetail")
      .exec();

    res.status(201).json(populatedPost);
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating post:", error.message);
    if (error.errors) {
      for (const key in error.errors) {
        console.error(`${key}: ${error.errors[key].message}`);
      }
    }
    res
      .status(500)
      .json({ message: "Failed to create post", error: error.message });
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
