import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Achiever } from "@/lib/models/achiever.model";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    await connectToDatabase();

    // If admin or instructor, show all. If public/student, show only visible
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "INSTRUCTOR";
    const filter: Record<string, any> = isAdmin ? {} : { isVisible: true };

    const url = new URL(req.url);
    const year = url.searchParams.get("year");
    const exam = url.searchParams.get("exam");
    const className = url.searchParams.get("class");
    const search = url.searchParams.get("search");

    if (year) filter["year"] = year;
    if (exam) filter["exam"] = exam;
    if (className) filter["className"] = className;
    if (search) {
      filter["name"] = { $regex: search, $options: "i" };
    }

    const achievers = await Achiever.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(achievers, { status: 200 });
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

    if (!body.name || !body.className || !body.exam || !body.score || !body.year || !body.imageUrl) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const achiever = await Achiever.create({
      name: body.name,
      className: body.className,
      exam: body.exam,
      score: body.score,
      year: body.year,
      imageUrl: body.imageUrl,
      message: body.message || "",
      badge: body.badge || "",
      isVisible: body.isVisible !== undefined ? body.isVisible : true,
    });

    return NextResponse.json({ message: "Achiever added successfully", achiever }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
