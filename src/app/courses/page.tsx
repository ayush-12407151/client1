import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import { Course } from "@/lib/models/course.model";

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams;
  await connectToDatabase();

  const filter: any = { isPublished: true };
  if (resolvedParams.category) {
    filter.category = { $regex: new RegExp(resolvedParams.category, "i") };
  }

  const courses = await Course.find(filter).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {resolvedParams.category ? `${resolvedParams.category.toUpperCase()} Courses` : "Explore Courses"}
          </h1>
          <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">
            Learn from India's top educators. Structured courses for JEE, NEET and Board exams.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <Link href="/courses"><Badge variant={!resolvedParams.category ? "default" : "outline"} className="px-4 py-2 text-sm cursor-pointer rounded-lg">All</Badge></Link>
          <Link href="/courses?category=jee"><Badge variant={resolvedParams.category === "jee" ? "default" : "outline"} className="px-4 py-2 text-sm cursor-pointer rounded-lg">JEE</Badge></Link>
          <Link href="/courses?category=neet"><Badge variant={resolvedParams.category === "neet" ? "default" : "outline"} className="px-4 py-2 text-sm cursor-pointer rounded-lg">NEET</Badge></Link>
          <Link href="/courses?category=boards"><Badge variant={resolvedParams.category === "boards" ? "default" : "outline"} className="px-4 py-2 text-sm cursor-pointer rounded-lg">Boards</Badge></Link>
          <Link href="/courses?category=foundation"><Badge variant={resolvedParams.category === "foundation" ? "default" : "outline"} className="px-4 py-2 text-sm cursor-pointer rounded-lg">Foundation</Badge></Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-500 mb-6">We're adding new courses regularly. Check back soon!</p>
            <Link href="/courses"><Button variant="outline">View All Courses</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => {
              const totalLessons = course.sections?.reduce((s: number, sec: any) => s + (sec.lessons?.length || 0), 0) || 0;
              return (
                <Card key={course._id.toString()} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-slate-100 group">
                  <div className="h-48 relative overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
                        {course.title?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-indigo-700 hover:bg-white font-semibold">{course.category}</Badge>
                    </div>
                  </div>
                  <CardHeader className="p-5 pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center text-amber-500 text-sm font-medium">
                        <Star className="w-4 h-4 mr-1 fill-current" /> 4.8
                        <span className="text-slate-400 ml-1">({course.studentsEnrolled || 0})</span>
                      </div>
                      <div className="font-bold text-lg text-slate-900">
                        {course.price === 0 ? "Free" : `₹${course.price}`}
                      </div>
                    </div>
                    <h3 className="font-bold text-xl leading-tight line-clamp-2 text-slate-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{course.shortDescription || course.description}</p>
                  </CardHeader>
                  <CardContent className="p-5 pt-4">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {totalLessons} Lessons</div>
                      <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.studentsEnrolled || 0} Students</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0">
                    <Link href={`/courses/${course._id.toString()}`} className="w-full">
                      <Button className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold rounded-xl">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
