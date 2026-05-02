import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user.model";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (body.fatherName !== undefined) user.fatherName = body.fatherName;
    if (body.motherName !== undefined) user.motherName = body.motherName;
    if (body.schoolName !== undefined) user.schoolName = body.schoolName;
    if (body.className !== undefined) user.className = body.className;

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully", user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
