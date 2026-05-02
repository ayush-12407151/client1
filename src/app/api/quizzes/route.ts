import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Quiz } from "@/lib/models/quiz.model";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Admins see all quizzes, students see only published ones
    const filter = session.user.role === "ADMIN" || session.user.role === "INSTRUCTOR" ? {} : { isPublished: true };

    let quizzes = await Quiz.find(filter).sort({ createdAt: -1 }).lean();

    // If user is a student, attach their past attempt counts so frontend knows if they can take it
    if (session.user.role === "STUDENT") {
      const { QuizAttempt } = await import("@/lib/models/attempt.model");
      
      const quizzesWithAttempts = await Promise.all(quizzes.map(async (quiz) => {
        const attemptCount = await QuizAttempt.countDocuments({
          userId: session.user.id,
          quizId: quiz._id,
          status: { $ne: "IN_PROGRESS" }
        });
        return { ...quiz, attemptCount };
      }));
      
      return NextResponse.json(quizzesWithAttempts, { status: 200 });
    }

    return NextResponse.json(quizzes, { status: 200 });
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

    if (!body.title || !body.category || !body.difficulty || !body.duration) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const quiz = await Quiz.create({
      title: body.title,
      description: body.description || "",
      category: body.category,
      difficulty: body.difficulty,
      duration: body.duration,
      marksPerQuestion: body.marksPerQuestion || 1,
      negativeMarking: body.negativeMarking || false,
      negativeMarksValue: body.negativeMarksValue || 0,
      maxAttempts: body.maxAttempts || 1,
      instructorId: session.user.id,
      isPublished: body.isPublished || false,
    });

    return NextResponse.json({ message: "Quiz created successfully", quiz }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
