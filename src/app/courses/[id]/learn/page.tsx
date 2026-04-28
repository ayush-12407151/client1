import { connectToDatabase } from "@/lib/db";
import { Course } from "@/lib/models/course.model";
import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LearnClient from "./LearnClient";

export default async function LearnPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect(`/login?callbackUrl=/courses/${params.id}/learn`);
  }

  await connectToDatabase();

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    notFound();
  }

  const course = await Course.findById(params.id).lean();

  if (!course) {
    notFound();
  }

  // Convert the MongoDB object to a plain JS object to pass to the Client Component
  const plainCourse = JSON.parse(JSON.stringify(course));

  return <LearnClient course={plainCourse} />;
}
