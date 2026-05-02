import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user.model";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch all users with role STUDENT
    const students = await User.find({ role: "STUDENT" }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(students, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized. Only admins can manually add students." }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      image: body.image || "",
      fatherName: body.fatherName || "",
      motherName: body.motherName || "",
      schoolName: body.schoolName || "",
      className: body.className || "",
      admissionDate: body.admissionDate ? new Date(body.admissionDate) : new Date(),
      isEnrolled: body.isEnrolled || false,
      monthlyFee: body.monthlyFee || 0,
      feePayments: [],
      role: "STUDENT",
    });

    return NextResponse.json({ message: "Student created successfully", user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
