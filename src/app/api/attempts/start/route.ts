import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { QuizAttempt } from "@/lib/models/attempt.model";
import { Quiz } from "@/lib/models/quiz.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { quizId } = await req.json();

    if (!quizId) {
      return NextResponse.json({ message: "Quiz ID required" }, { status: 400 });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz || (!quiz.isPublished && session.user.role === "STUDENT")) {
      return NextResponse.json({ message: "Quiz not found or not available" }, { status: 404 });
    }

    // Check if there is an in-progress attempt
    const existing = await QuizAttempt.findOne({ userId: session.user.id, quizId, status: "IN_PROGRESS" });
    if (existing) {
      return NextResponse.json({ message: "Already started", attempt: existing }, { status: 200 });
    }

    // Check if max attempts reached
    const maxAttempts = quiz.maxAttempts || 1;
    const pastAttemptsCount = await QuizAttempt.countDocuments({ 
      userId: session.user.id, 
      quizId,
      status: { $ne: "IN_PROGRESS" } 
    });

    if (pastAttemptsCount >= maxAttempts) {
      return NextResponse.json(
        { message: `You have reached the maximum number of attempts (${maxAttempts}) for this quiz.` }, 
        { status: 403 }
      );
    }

    const attempt = await QuizAttempt.create({
      userId: session.user.id,
      quizId,
      startTime: new Date(),
      status: "IN_PROGRESS",
    });

    return NextResponse.json({ message: "Quiz started", attempt }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
