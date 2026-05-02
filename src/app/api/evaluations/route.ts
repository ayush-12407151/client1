import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { QuizAttempt } from "@/lib/models/attempt.model";
import { User } from "@/lib/models/user.model";
import { Question } from "@/lib/models/quiz.model";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");
    
    if (!quizId) {
      return NextResponse.json({ message: "Quiz ID required" }, { status: 400 });
    }

    // Fetch attempts that have subjective answers (assuming they are pending or evaluated)
    const attempts = await QuizAttempt.find({ 
      quizId, 
      status: { $in: ["PENDING_EVALUATION", "EVALUATED"] } 
    }).populate({ path: "userId", select: "name email", model: User }).lean();

    return NextResponse.json(attempts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { attemptId, marksUpdates, feedback } = body;
    // marksUpdates is an object: { [questionId]: marksAwarded }

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return NextResponse.json({ message: "Attempt not found" }, { status: 404 });
    }

    let totalSubjectiveMarks = 0;

    attempt.answers.forEach((ans: any) => {
      const qId = ans.questionId.toString();
      if (marksUpdates[qId] !== undefined) {
        ans.marksAwarded = Number(marksUpdates[qId]);
        totalSubjectiveMarks += ans.marksAwarded;
      } else if (ans.marksAwarded) {
         // Keep existing subjective marks if not updated
         totalSubjectiveMarks += ans.marksAwarded;
      }
    });

    attempt.subjectiveMarks = totalSubjectiveMarks;
    attempt.totalScore = attempt.score + attempt.subjectiveMarks;
    attempt.status = "EVALUATED";
    attempt.evaluationFeedback = feedback;
    attempt.evaluatorId = session.user.id;

    await attempt.save();

    return NextResponse.json({ message: "Evaluated successfully", attempt }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
