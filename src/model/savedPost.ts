import mongoose, { Document, Schema } from "mongoose";

// Assuming User and Post interfaces are already defined
// import User from "./User";
// import Post from "./Post";

export interface ISavedPost extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SavedPostSchema: Schema<ISavedPost> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create unique compound index
SavedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });

const SavedPost = mongoose.model<ISavedPost>("SavedPost", SavedPostSchema);

export default SavedPost;
