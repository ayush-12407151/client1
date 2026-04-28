import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user.model";
import { Course } from "@/lib/models/course.model";
import { Order } from "@/lib/models/order.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ message: "Course ID required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return NextResponse.json({ message: "Already enrolled" }, { status: 409 });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    // For free courses or demo: enroll directly
    // For paid courses, this would integrate with Razorpay
    // For now we do direct enrollment and create an order record
    const order = await Order.create({
      userId: user._id,
      courseId: course._id,
      amount: course.price,
      status: "COMPLETED",
    });

    // Add course to user's enrolledCourses
    user.enrolledCourses.push(course._id);
    await user.save();

    // Increment studentsEnrolled on the course
    course.studentsEnrolled = (course.studentsEnrolled || 0) + 1;
    await course.save();

    return NextResponse.json({ message: "Enrolled successfully", orderId: order._id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
