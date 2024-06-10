import mongoose, { Document, Schema } from "mongoose";

export interface IPostDetail extends Document {
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
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post",
      unique: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

PostDetailSchema.virtual("id").get(function (this: IPostDetail) {
  return this._id.toHexString();
});

PostDetailSchema.set("toJSON", { virtuals: true });
PostDetailSchema.set("toObject", { virtuals: true });

const PostDetail = mongoose.model<IPostDetail>("PostDetail", PostDetailSchema);

export default PostDetail;
