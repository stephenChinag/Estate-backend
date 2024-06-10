import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the PostDetail document
export interface IPostDetail extends Document {
  _id: mongoose.Types.ObjectId;
  desc: string;
  utilities?: string | null;
  pet?: string | null;
  income?: string | null;
  size?: number | null;
  school?: number | null;
  bus?: number | null;
  restaurant?: number | null;
  postId: mongoose.Types.ObjectId;
}

// Create the PostDetail schema
const PostDetailSchema: Schema<IPostDetail> = new Schema(
  {
    desc: { type: String, required: true },
    utilities: { type: String, default: null },
    pet: { type: String, default: null },
    income: { type: String, default: null },
    size: { type: Number, default: null },
    school: { type: Number, default: null },
    bus: { type: Number, default: null },
    restaurant: { type: Number, default: null },
    postId: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Create a virtual field "id" that maps to "_id"
PostDetailSchema.virtual("id").get(function (this: IPostDetail) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
PostDetailSchema.set("toJSON", { virtuals: true });
PostDetailSchema.set("toObject", { virtuals: true });

const PostDetail = mongoose.model<IPostDetail>("PostDetail", PostDetailSchema);

export default PostDetail;
