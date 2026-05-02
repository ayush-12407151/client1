import mongoose, { Schema, Document } from "mongoose";

export interface IAchiever extends Document {
  name: string;
  className: string; // e.g. "10th", "12th", "Dropper"
  exam: string; // e.g. "JEE", "NEET", "Boards"
  score: string; // e.g. "AIR 156", "98.4%", "695/720"
  year: string; // e.g. "2024"
  imageUrl: string;
  message?: string; // Optional short message
  badge?: string; // e.g. "Topper", "AIR Rank", "Distinction"
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AchieverSchema = new Schema(
  {
    name: { type: String, required: true },
    className: { type: String, required: true },
    exam: { type: String, required: true },
    score: { type: String, required: true },
    year: { type: String, required: true },
    imageUrl: { type: String, required: true },
    message: { type: String },
    badge: { type: String },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Achiever = mongoose.models.Achiever || mongoose.model<IAchiever>("Achiever", AchieverSchema);
