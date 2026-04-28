import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models/order.model";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId, amount } = await req.json();

    if (!courseId || !amount) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create Razorpay Order
    const options = {
      amount: amount * 100, // Amount in paise (multiply by 100)
      currency: "USD", // Change to INR if needed
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    await connectToDatabase();

    // Create Order Record in DB
    const order = await Order.create({
      userId: session.user.id,
      courseId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      status: "PENDING",
    });

    return NextResponse.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      orderDbId: order._id,
    });
  } catch (error: any) {
    console.error("Razorpay error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
