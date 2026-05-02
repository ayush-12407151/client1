import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user.model";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const student = await User.findById(params.id).lean();
    if (!student || student.role !== "STUDENT") {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized. Only admins can edit students." }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    const student = await User.findById(params.id);
    if (!student || student.role !== "STUDENT") {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Update basic fields
    if (body.name !== undefined) student.name = body.name;
    if (body.email !== undefined) student.email = body.email;
    if (body.fatherName !== undefined) student.fatherName = body.fatherName;
    if (body.motherName !== undefined) student.motherName = body.motherName;
    if (body.schoolName !== undefined) student.schoolName = body.schoolName;
    if (body.className !== undefined) student.className = body.className;
    if (body.isEnrolled !== undefined) student.isEnrolled = body.isEnrolled;
    if (body.monthlyFee !== undefined) student.monthlyFee = body.monthlyFee;
    if (body.admissionDate !== undefined) student.admissionDate = new Date(body.admissionDate);

    // Add new fee payment
    if (body.newPayment) {
      if (!student.feePayments) student.feePayments = [];
      student.feePayments.push({
        month: body.newPayment.month,
        amount: body.newPayment.amount,
        datePaid: new Date(),
        receiptId: body.newPayment.receiptId || `REC-${Date.now()}`
      });
    }

    // Remove a fee payment
    if (body.removePaymentId) {
      student.feePayments = student.feePayments.filter((p: any) => p._id.toString() !== body.removePaymentId);
    }

    await student.save();

    return NextResponse.json({ message: "Student updated successfully", student }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized. Only admins can delete students." }, { status: 401 });
    }

    await connectToDatabase();
    
    const result = await User.deleteOne({ _id: params.id, role: "STUDENT" });
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
