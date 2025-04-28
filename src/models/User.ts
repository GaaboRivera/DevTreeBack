import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
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

const User = mongoose.model("User", userSchema);
export default User;
