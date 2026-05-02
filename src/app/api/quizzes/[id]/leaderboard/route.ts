import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { QuizAttempt } from "@/lib/models/attempt.model";
import { User } from "@/lib/models/user.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // Allow anyone (authenticated) to view leaderboard
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;

    const attempts = await QuizAttempt.find({ 
      quizId: resolvedParams.id, 
      status: "EVALUATED" 
    })
    .populate({ path: "userId", select: "name image", model: User })
    .lean();

    // Map and calculate time taken (in seconds)
    let leaderboard = attempts.map((attempt: any) => {
      const startTime = new Date(attempt.startTime).getTime();
      const endTime = new Date(attempt.endTime || attempt.updatedAt).getTime();
      const timeTaken = Math.floor((endTime - startTime) / 1000);

      return {
        id: attempt._id,
        user: attempt.userId,
        score: attempt.totalScore,
        timeTaken: timeTaken,
      };
    });

    // Sort by Score (Desc), then by Time Taken (Asc)
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeTaken - b.timeTaken;
    });

    // Assign ranks
    leaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
