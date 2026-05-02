import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  quizId: mongoose.Types.ObjectId;
  text: string;
  type: "MCQ" | "MULTIPLE_CORRECT" | "TRUE_FALSE" | "SUBJECTIVE";
  options?: { text: string; isCorrect: boolean }[];
  marks?: number; // Override default quiz marks
  negativeMarks?: number; // Override default negative marks
  explanation?: string; // AI generated or manual explanation
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number; // in minutes
  instructorId: mongoose.Types.ObjectId;
  isPublished: boolean;
  marksPerQuestion: number;
  negativeMarking: boolean;
  negativeMarksValue: number; // e.g. 0.25
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true, default: false },
});

const QuestionSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["MCQ", "MULTIPLE_CORRECT", "TRUE_FALSE", "SUBJECTIVE"],
      required: true,
    },
    options: [OptionSchema],
    marks: { type: Number },
    negativeMarks: { type: Number },
    explanation: { type: String },
  },
  { timestamps: true }
);

const QuizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    duration: { type: Number, required: true }, // duration in minutes
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: false },
    marksPerQuestion: { type: Number, default: 1 },
    negativeMarking: { type: Boolean, default: false },
    negativeMarksValue: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Question =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
export const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);
