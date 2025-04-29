import mongoose, { Schema } from "mongoose";

interface IUser {
  handle: string;
  name: string;
  email: string;
  password: string;
  //   isAdmin: boolean;
}

const userSchema = new Schema({
  handle: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  //   isAdmin: {
  //     type: Boolean,
  //     default: false,
  //   },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
