import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  enrolledCourses: mongoose.Types.ObjectId[];
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google OAuth users
    image: { type: String },
    role: { 
      type: String, 
      enum: ["STUDENT", "INSTRUCTOR", "ADMIN"], 
      default: "STUDENT" 
    },
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
