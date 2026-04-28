import { connectToDatabase } from "@/lib/db";
import { Course } from "@/lib/models/course.model";
import { User } from "@/lib/models/user.model";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Users, PlayCircle, Star, ShieldCheck } from "lucide-react";
import EnrollButton from "./EnrollButton";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// This is a Server Component
export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  await connectToDatabase();
  
  // Quick seeding logic for demonstration if database is completely empty
  const courseCount = await Course.countDocuments();
  if (courseCount === 0) {
    // Create a dummy instructor
    const instructor = await User.findOneAndUpdate(
      { email: "instructor@example.com" },
      { name: "Jane Doe", email: "instructor@example.com", password: "hashed_password", role: "INSTRUCTOR" },
      { upsert: true, new: true }
    );

    // Create the seed course
    const seedCourse = await Course.create({
      title: "Advanced Web Development 2026",
      description: "Master modern web development using Next.js, React, Node, and MongoDB. Build production-ready scalable applications.",
      category: "Programming",
      instructorId: instructor._id,
      price: 49.99,
      isPublished: true,
      studentsEnrolled: 1240,
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      sections: [
        {
          title: "Getting Started",
          lessons: [
            { title: "Course Introduction", duration: 300, youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", isFreePreview: true },
            { title: "Environment Setup", duration: 750, youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", isFreePreview: false }
          ]
        }
      ]
    });
    
    // Auto redirect to the new valid seed ID if they typed an invalid one
    if (params.id === "1" || !mongoose.Types.ObjectId.isValid(params.id)) {
      params.id = seedCourse._id.toString();
    }
  }

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    notFound();
  }

  const course = await Course.findById(params.id).populate("instructorId", "name").lean();

  if (!course) {
    notFound();
  }

  // Check if the current user is already enrolled
  const session = await getServerSession(authOptions);
  let isEnrolled = false;
  if (session?.user?.email) {
    const currentUser = await User.findOne({ email: session.user.email }).lean();
    if (currentUser?.enrolledCourses?.some((id: any) => id.toString() === params.id)) {
      isEnrolled = true;
    }
  }

  const whatYouWillLearn = [
    "Build full-stack React applications with Next.js",
    "Master server components and server actions",
    "Integrate secure authentication with Auth.js",
    "Process payments securely using Razorpay"
  ];

  return (
    <div className="bg-white flex-1">
      {/* Hero Header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="col-span-2 space-y-6">
            <Badge className="bg-blue-600 hover:bg-blue-600">{course.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{course.title}</h1>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center text-yellow-400 font-medium">
                <Star className="w-5 h-5 mr-1 fill-current" />
                4.8 Rating
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {course.studentsEnrolled} Students Enrolled
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                24h 30m
              </div>
            </div>
            <p className="text-sm">Created by <span className="text-blue-400 font-medium">{course.instructorId?.name || "Unknown"}</span></p>
          </div>
          
          <div className="col-span-1">
            <div className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <img src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-8">
                <div className="text-4xl font-bold mb-6">{course.price === 0 ? "Free" : `₹${course.price}`}</div>
                {/* Client Component for Interactivity */}
                <EnrollButton courseId={course._id.toString()} price={course.price} isEnrolled={isEnrolled} />
                <div className="flex items-center justify-center text-sm text-gray-500 gap-2 mt-4">
                  <ShieldCheck className="w-4 h-4" /> 30-Day Money-Back Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="col-span-2 space-y-12">
          
          {/* What you'll learn */}
          <div className="border border-gray-200 rounded-2xl p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whatYouWillLearn.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {course.sections.map((section: any, sIdx: number) => (
                <div key={sIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-900">
                    {section.title}
                  </div>
                  <div className="divide-y divide-gray-100">
                    {section.lessons.map((lesson: any, lIdx: number) => (
                      <div key={lIdx} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <PlayCircle className={`w-5 h-5 ${lesson.isFreePreview ? "text-blue-600" : "text-gray-400"}`} />
                          <span className={lesson.isFreePreview ? "text-blue-600 font-medium cursor-pointer hover:underline" : "text-gray-700"}>
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {lesson.isFreePreview && <Badge variant="outline" className="text-blue-600 border-blue-200">Preview</Badge>}
                          <span className="text-sm text-gray-500">{Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
