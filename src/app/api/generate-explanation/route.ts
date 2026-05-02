import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { question, options, type } = body;

    if (!question) {
      return NextResponse.json({ message: "Question text is required" }, { status: 400 });
    }

    // Default to an environment variable, but since we don't know if they have it, check.
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        message: "GEMINI_API_KEY is not configured in .env.local",
        explanation: "Please add GEMINI_API_KEY to your .env.local file to use AI generation."
      }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `You are an expert tutor. Please provide a clear, concise educational explanation for the following question.\n\nQuestion: ${question}\n\n`;
    
    if (type !== "SUBJECTIVE" && options && options.length > 0) {
      prompt += `Options:\n`;
      options.forEach((opt: any, index: number) => {
        prompt += `${index + 1}. ${opt.text} ${opt.isCorrect ? "(Correct Answer)" : ""}\n`;
      });
      prompt += `\nPlease explain why the correct answer is correct, and briefly why the other options are incorrect.`;
    } else {
       prompt += `\nPlease provide a model solution and explanation for this subjective question.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ explanation: text }, { status: 200 });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
