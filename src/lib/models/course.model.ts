import mongoose, { Schema, Document } from "mongoose";

export interface ILesson {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  youtubeUrl: string;
  duration?: number;
  isFreePreview: boolean;
}

export interface ISection {
  _id: mongoose.Types.ObjectId;
  title: string;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  category: string;
  instructorId: mongoose.Types.ObjectId;
  price: number;
  isPublished: boolean;
  sections: ISection[];
  studentsEnrolled: number;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  youtubeUrl: { type: String, required: true },
  duration: { type: Number }, // in seconds
  isFreePreview: { type: Boolean, default: false },
});

const SectionSchema = new Schema({
  title: { type: String, required: true },
  lessons: [LessonSchema],
});

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    thumbnail: { type: String },
    category: { type: String, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, default: false },
    sections: [SectionSchema],
    studentsEnrolled: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
