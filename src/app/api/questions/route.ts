import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Question } from "@/lib/models/quiz.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    if (!body.quizId || !body.text || !body.type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const question = await Question.create({
      quizId: body.quizId,
      text: body.text,
      type: body.type,
      options: body.options || [],
      marks: body.marks,
      negativeMarks: body.negativeMarks,
      explanation: body.explanation,
    });

    return NextResponse.json({ message: "Question added successfully", question }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Bulk upload questions
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { quizId, questions } = await req.json();

    if (!quizId || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q: any) => ({
        quizId,
        text: q.text,
        type: q.type,
        options: q.options || [],
        marks: q.marks,
        negativeMarks: q.negativeMarks,
        explanation: q.explanation,
      }))
    );

    return NextResponse.json({ message: "Questions added successfully", count: createdQuestions.length }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
