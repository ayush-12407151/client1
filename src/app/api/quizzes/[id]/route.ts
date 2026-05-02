import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Quiz, Question } from "@/lib/models/quiz.model";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const resolvedParams = await params;
    const quiz = await Quiz.findById(resolvedParams.id).lean();
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // Only allow students to see published quizzes
    if (session.user.role === "STUDENT" && !quiz.isPublished) {
      return NextResponse.json({ message: "Quiz not available" }, { status: 403 });
    }

    // Fetch questions
    const questions = await Question.find({ quizId: resolvedParams.id }).lean();
    
    // If student, remove the isCorrect flag from options to prevent cheating
    if (session.user.role === "STUDENT") {
      questions.forEach((q: any) => {
        if (q.options) {
          q.options.forEach((opt: any) => delete opt.isCorrect);
        }
      });
    }

    return NextResponse.json({ quiz, questions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const resolvedParams = await params;

    const updated = await Quiz.findByIdAndUpdate(
      resolvedParams.id,
      {
        title: body.title,
        description: body.description,
        category: body.category,
        difficulty: body.difficulty,
        duration: body.duration,
        marksPerQuestion: body.marksPerQuestion,
        negativeMarking: body.negativeMarking,
        negativeMarksValue: body.negativeMarksValue,
        maxAttempts: body.maxAttempts,
        isPublished: body.isPublished,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully", quiz: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const resolvedParams = await params;
    await Quiz.findByIdAndDelete(resolvedParams.id);
    await Question.deleteMany({ quizId: resolvedParams.id }); // cascade delete

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
