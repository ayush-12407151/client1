import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { QuizAttempt } from "@/lib/models/attempt.model";
import { Quiz, Question } from "@/lib/models/quiz.model";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const resolvedParams = await params;
    
    // Find the most recent attempt by this user for this quiz
    const attempt = await QuizAttempt.findOne({ 
      quizId: resolvedParams.id, 
      userId: session.user.id 
    }).sort({ createdAt: -1 }).lean();

    if (!attempt) {
      return NextResponse.json({ message: "No attempt found" }, { status: 404 });
    }

    const quiz = await Quiz.findById(resolvedParams.id).lean();
    const questions = await Question.find({ quizId: resolvedParams.id }).lean();

    return NextResponse.json({ quiz, attempt, questions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
