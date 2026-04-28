import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { 
      type: String, 
      enum: ["PENDING", "COMPLETED", "FAILED"], 
      default: "PENDING" 
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
