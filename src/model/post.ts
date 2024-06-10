import mongoose, { Document, Schema } from "mongoose";
import { IPostDetail } from "./postdetails";

export enum Type {
  BUY = "buy",
  RENT = "rent",
}

export enum Property {
  APARTMENT = "apartment",
  HOUSE = "house",
  CONDO = "condo",
  LAND = "land",
}

export interface IPost extends Document {
  title: string;
  price: number;
  images: string[];
  address: string;
  city: string;
  bedroom: number;
  bathroom: number;
  latitude: string;
  longitude: string;
  type: Type;
  property: Property;
  createdAt: Date;
  userId: mongoose.Types.ObjectId;
  postDetail?: IPostDetail;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    type: { type: String, enum: Object.values(Type), required: true },
    property: { type: String, enum: Object.values(Property), required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    postDetail: {
      type: Schema.Types.ObjectId,
      ref: "PostDetail",
      default: null,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

PostSchema.virtual("id").get(function (this: IPost) {
  return this._id.toHexString();
});

PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
