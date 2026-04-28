import mongoose, { Schema, Document } from "mongoose";

export interface IStudyMaterial extends Document {
  title: string;
  description?: string;
  type: "video" | "notes" | "assignment";
  url: string; // YouTube URL, or file download URL
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudyMaterialSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["video", "notes", "assignment"], required: true },
    url: { type: String, required: true },
    category: { type: String, default: "General" },
  },
  { timestamps: true }
);

export const StudyMaterial =
  mongoose.models.StudyMaterial || mongoose.model<IStudyMaterial>("StudyMaterial", StudyMaterialSchema);
