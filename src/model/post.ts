import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import User from "./user";

export interface PostDocument extends Document {
  title: string;
  img: string;
  bedroom: number;
  bathroom: number;
  price: number;
  address: string;
  latitude: number;
  longitude: number;
  type: "buy" | "rent";
  property: "apartment" | "house" | "condo" | "land";
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<PostDocument>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  title: { type: String, required: true },
  img: { type: String, required: true },
  bedroom: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  type: { type: String, enum: ["buy", "rent"], required: true },
  property: { type: String, enum: ["apartment", "house", "condo", "land"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// You can use the uniqueValidator plugin if you have unique fields.
// postSchema.plugin(uniqueValidator);

const Post = mongoose.model<PostDocument>("Post", postSchema);

export default Post;

// module.exports = mongoose.model("Post", postSchema);
