import { Request, Response } from "express";
import Post from "../model/post"; // Assuming the Post model is in models/post.ts
import mongoose, { Types } from "mongoose";
import PostDetail from "../model/postdetails";
import User from "../model/user";
// Get all posts

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  const query = req.query;
  console.log(query);
  try {
    let posts;

    // Check if there are any query parameters
    if (Object.keys(query).length === 0) {
      // If no query parameters, fetch all posts
      posts = await Post.find({});
    } else {
      // Build case-insensitive queries for city, type, minPrice, and maxPrice fields
      const cityQuery = query.city
        ? { $regex: new RegExp(query.city as string, "i") }
        : undefined;
      const typeQuery = query.type
        ? { $regex: new RegExp(query.type as string, "i") }
        : undefined;
      const minPriceQuery = query.minPrice
        ? parseInt(query.minPrice as string)
        : undefined;
      const maxPriceQuery = query.maxPrice
        ? parseInt(query.maxPrice as string)
        : undefined;

      // Build the final query object
      const queryObject: any = {};
      if (cityQuery) queryObject.city = cityQuery;
      if (typeQuery) queryObject.type = typeQuery;
      if (minPriceQuery !== undefined)
        queryObject.price = { ...queryObject.price, $gte: minPriceQuery };
      if (maxPriceQuery !== undefined)
        queryObject.price = { ...queryObject.price, $lte: maxPriceQuery };

      posts = await Post.find(queryObject);
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Get a single post by ID
export const getPost = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id)
      .populate({
        path: "userId",
        model: User, // Model to use for population
        select: "name email username avatar", // Adjust as per your User model fields
      })
      .populate("postDetail")
      .exec();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addPost = async (req: Request, res: Response): Promise<void> => {
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create new Post
    const newPost = new Post({
      ...postData,
      userId: tokenUserId,
    });

    const savedPost = await newPost.save({ session });

    // Create new PostDetail if provided
    if (postDetail) {
      const newPostDetail = new PostDetail({
        ...postDetail,
        postId: savedPost._id,
      });
      const savedPostDetail = await newPostDetail.save({ session });

      // Update the Post with the PostDetail reference
      savedPost.postDetail = savedPostDetail._id;
      await savedPost.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    // Populate the postDetail field in the savedPost
    const populatedPost = await Post.findById(savedPost._id)
      .populate("postDetail")
      .exec();

    res.status(201).json(populatedPost);
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating post:", err.message);
    res
      .status(500)
      .json({ message: "Failed to create post", error: err.message });
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
//66929920313ef364baa9f9ae
