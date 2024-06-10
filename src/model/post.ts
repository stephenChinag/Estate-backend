import mongoose, { Document, Schema } from "mongoose";

import PostDetail, { IPostDetail } from "./postdetails";

interface IPost extends Document {
  title: string;
  price: number;
  img: string;
  address: string;
  city: string;
  bedroom: number;
  bathroom: number;
  type: string;
  property: string;
  latitude: number;
  longitude: number;
  userId: mongoose.Types.ObjectId;
  postDetail?: IPostDetail; // Optional, because it might not be present
}

// Create the Post schema
const PostSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    type: { type: String, required: true },
    property: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    postDetail: {
      type: Schema.Types.ObjectId,
      ref: "PostDetail",
      default: null,
    }, // Reference to PostDetail
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Create a virtual field "id" that maps to "_id"
PostSchema.virtual("id").get(function (this: IPost) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
