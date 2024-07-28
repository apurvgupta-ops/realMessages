import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "User Name is requried"],
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is requried"],
    unique: true,
    match: [
      /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/gim,
      "Please provide the valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
  },

  verifyCode: {
    type: String,
    required: [true, "Please enter verify code"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },

  messages: [MessageSchema],
});

// Nextjs always run on edge means nextjs dont know this schema runs for first time or already exists (Next js is a edge time framework.)

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model("User", UserSchema);

export default UserModel;
