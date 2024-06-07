import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: Date;
}
const userSchema = new Schema<UserDocument>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
