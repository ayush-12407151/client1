import mongoose, { Schema, Document } from "mongoose";

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedOptions?: mongoose.Types.ObjectId[];
  fileUrls?: string[];
  marksAwarded?: number;
}

export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  score: number; // Objective score
  subjectiveMarks: number; // Subjective score
  totalScore: number;
  status: "IN_PROGRESS" | "SUBMITTED" | "PENDING_EVALUATION" | "EVALUATED";
  answers: IAnswer[];
  evaluationFeedback?: string;
  evaluatorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  selectedOptions: [{ type: Schema.Types.ObjectId }],
  fileUrls: [{ type: String }],
  marksAwarded: { type: Number, default: 0 },
});

const QuizAttemptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date },
    score: { type: Number, default: 0 },
    subjectiveMarks: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "SUBMITTED", "PENDING_EVALUATION", "EVALUATED"],
      default: "IN_PROGRESS",
    },
    answers: [AnswerSchema],
    evaluationFeedback: { type: String },
    evaluatorId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const QuizAttempt =
  mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);
