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
    utilities: { type: String, required: true },
    pet: { type: String, required: true },
    income: { type: String, required: true },
    size: { type: Number, required: true },
    school: { type: Number, required: true },
    bus: { type: Number, required: true },
    restaurant: { type: Number, required: true },
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
