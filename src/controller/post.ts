import { Request, Response } from 'express';
import Post from '../model/post'; // Assuming the Post model is in models/post.ts
import mongoose, { Types } from 'mongoose';
import PostDetail from '../model/postdetails';
import User from '../model/user';
import SavedPost from '../model/savedPost';
// Get all posts

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  const query = req.query;

  try {
    let posts;

    // Check if there are any query parameters
    if (Object.keys(query).length === 0) {
      // If no query parameters, fetch all posts
      posts = await Post.find();
    } else {
      // Build case-insensitive queries for city, type, property, bedroom, minPrice, and maxPrice fields
      const cityQuery = query.city
        ? { $regex: new RegExp(query.city as string, 'i') }
        : undefined;
      const typeQuery = query.type
        ? { $regex: new RegExp(query.type as string, 'i') }
        : undefined;
      const propertyQuery = query.property
        ? { $regex: new RegExp(query.property as string, 'i') }
        : undefined;
      const bedroomQuery = query.bedroom
        ? parseInt(query.bedroom as string)
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
      if (propertyQuery) queryObject.property = propertyQuery;
      if (bedroomQuery !== undefined) queryObject.bedroom = bedroomQuery;
      if (minPriceQuery !== undefined || maxPriceQuery !== undefined) {
        queryObject.price = {};
        if (minPriceQuery !== undefined) queryObject.price.$gte = minPriceQuery;
        if (maxPriceQuery !== undefined) queryObject.price.$lte = maxPriceQuery;
      }

      // Special handling for bedroom if provided
      if (bedroomQuery !== undefined) {
        queryObject.$or = [
          { bedroom: { $exists: false } }, // If bedroom field does not exist
          { bedroom: { $lte: bedroomQuery } }, // If bedroom is less than or equal to the provided value
        ];
      }

      posts = await Post.find(queryObject);
    }
    // setTimeout(() => {
    //   res.status(200).json(posts);
    // }, 3000);
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get posts' });
  }
};

// Get a single post by ID
export const getPost = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id)
      .populate({
        path: 'userId',
        model: User, // Model to use for population
        select: 'name email username avatar', // Adjust as per your User model fields
      })
      .populate('postDetail')
      .exec();
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
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
      .populate('postDetail')
      .exec();

    res.status(201).json(populatedPost);
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating post:', err.message);
    res
      .status(500)
      .json({ message: 'Failed to create post', error: err.message });
  }
};
// Update an existing post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
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
    return res.status(400).json({ message: 'Invalid post ID format' });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
//66929920313ef364baa9f9ae

// Save Post

export const savePost = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.body;
  const tokenUserId = req.userId;

  if (!postId) {
    res.status(400).json({ message: 'postId is required' });
    return;
  }

  try {
    // Check if the post is already saved
    const savePost = await SavedPost.findOneAndUpdate({
      userId: tokenUserId,
      postId,
    });

    if (savePost) {
      await SavedPost.deleteOne({
        id: savePost.id,
      });
    }

    res.status(201).json({ message: 'Post saved successfully' });
  } catch (err: any) {
    console.error('Error saving post:', err);
    res
      .status(500)
      .json({ message: 'Failed to save post', error: err.message });
  }
};
