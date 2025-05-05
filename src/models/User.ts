import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  handle: string;
  name: string;
  email: string;
  password: string;
  description: string;
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
  description: {
    type: String,
    default: '',
  },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
