import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { QuizAttempt } from "@/lib/models/attempt.model";
import { Quiz, Question } from "@/lib/models/quiz.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { attemptId, answers } = body; 
    // answers format: { [questionId]: { selectedOptions: string[], fileUrls: string[] } }

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt || attempt.userId.toString() !== session.user.id) {
      return NextResponse.json({ message: "Attempt not found" }, { status: 404 });
    }
    if (attempt.status !== "IN_PROGRESS") {
      return NextResponse.json({ message: "Already submitted" }, { status: 400 });
    }

    const quiz = await Quiz.findById(attempt.quizId);
    const questions = await Question.find({ quizId: attempt.quizId });

    let objectiveScore = 0;
    let hasSubjective = false;

    const formattedAnswers = [];

    for (const q of questions) {
      const studentAns = answers[q._id.toString()];
      const ansObj: any = {
        questionId: q._id,
      };

      if (q.type === "SUBJECTIVE") {
        if (studentAns && studentAns.fileUrls && studentAns.fileUrls.length > 0) {
          hasSubjective = true;
          ansObj.fileUrls = studentAns.fileUrls;
        }
      } else {
        if (studentAns && studentAns.selectedOptions) {
          ansObj.selectedOptions = studentAns.selectedOptions;

          // Evaluation logic
          const correctOptions = q.options.filter((o: any) => o.isCorrect).map((o: any) => o._id.toString());
          const selected = studentAns.selectedOptions;

          // For MCQ and MULTIPLE_CORRECT and TRUE_FALSE
          const isFullyCorrect = correctOptions.length === selected.length && correctOptions.every((optId: string) => selected.includes(optId));
          const isPartiallyCorrect = selected.length > 0 && selected.every((optId: string) => correctOptions.includes(optId));

          if (isFullyCorrect) {
             objectiveScore += (q.marks || quiz.marksPerQuestion);
          } else if (selected.length > 0 && quiz.negativeMarking) {
             objectiveScore -= (q.negativeMarks || quiz.negativeMarksValue);
          }
        }
      }

      formattedAnswers.push(ansObj);
    }

    attempt.endTime = new Date();
    attempt.score = objectiveScore;
    attempt.totalScore = objectiveScore; // initially subjective is 0
    attempt.status = hasSubjective ? "PENDING_EVALUATION" : "EVALUATED";
    attempt.answers = formattedAnswers;

    await attempt.save();

    return NextResponse.json({ message: "Quiz submitted successfully", attempt }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
