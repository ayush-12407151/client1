import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  enrolledCourses: mongoose.Types.ObjectId[];
  wishlist: mongoose.Types.ObjectId[];
  
  // Student Profile Fields
  fatherName?: string;
  motherName?: string;
  schoolName?: string;
  className?: string;
  admissionDate?: Date;
  isEnrolled?: boolean;
  monthlyFee?: number;
  feePayments?: {
    month: string;
    amount: number;
    datePaid: Date;
    receiptId?: string;
  }[];

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
    
    // Student Profile Fields
    fatherName: { type: String },
    motherName: { type: String },
    schoolName: { type: String },
    className: { type: String },
    admissionDate: { type: Date, default: Date.now },
    isEnrolled: { type: Boolean, default: false },
    monthlyFee: { type: Number, default: 0 },
    feePayments: [
      {
        month: { type: String, required: true },
        amount: { type: Number, required: true },
        datePaid: { type: Date, default: Date.now },
        receiptId: { type: String },
      }
    ]
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
