import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user.model";
import { Course } from "@/lib/models/course.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Clock, PlayCircle, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin");
  if (session.user.role === "INSTRUCTOR") redirect("/instructor");

  await connectToDatabase();

  // Fetch the real user with enrolled courses populated
  const user = await User.findOne({ email: session.user.email })
    .populate({ path: "enrolledCourses", model: Course, select: "title thumbnail category sections price instructorId" })
    .lean();

  const enrolledCourses = (user?.enrolledCourses || []) as any[];
  const totalLessons = enrolledCourses.reduce((sum: number, c: any) => {
    return sum + (c.sections?.reduce((s: number, sec: any) => s + (sec.lessons?.length || 0), 0) || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {session.user.name}! 👋</h1>
          <p className="text-slate-500 mt-1">Here's your learning progress overview.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/free-material">
              <Button variant="outline" className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold gap-2">
                <BookOpen className="w-4 h-4" /> Free Material
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold gap-2">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="border-indigo-100 shadow-none">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3"><BookOpen className="w-5 h-5" /></div>
              <p className="text-2xl font-extrabold text-slate-900">{enrolledCourses.length}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Enrolled Courses</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 shadow-none">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3"><Award className="w-5 h-5" /></div>
              <p className="text-2xl font-extrabold text-slate-900">{totalLessons}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Total Lessons Available</p>
            </CardContent>
          </Card>
          <Card className="border-amber-100 shadow-none">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3"><Clock className="w-5 h-5" /></div>
              <p className="text-2xl font-extrabold text-slate-900">{enrolledCourses.length > 0 ? "Active" : "—"}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Learning Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses or Empty State */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">My Courses</h2>
          <Link href="/courses" className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">Browse Courses <ArrowRight className="w-3 h-3" /></Link>
        </div>

        {enrolledCourses.length === 0 ? (
          /* Empty State */
          <Card className="border-dashed border-2 border-slate-200 shadow-none">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No courses yet</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">Start your preparation journey by enrolling in a course. We have specialised courses for JEE, NEET and Board exams.</p>
              <Link href="/courses">
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12 px-8 font-bold shadow-sm">
                  <BookOpen className="w-4 h-4 mr-2" /> Explore Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Real Enrolled Courses */
          <div className="space-y-4">
            {enrolledCourses.map((course: any) => (
              <Card key={course._id.toString()} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-56 h-40 md:h-auto relative bg-slate-200 flex-shrink-0 overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                        {course.title?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">{course.category}</div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{course.title}</h3>
                      <p className="text-slate-500 text-sm mb-3">
                        {course.sections?.length || 0} sections • {course.sections?.reduce((s: number, sec: any) => s + (sec.lessons?.length || 0), 0) || 0} lessons
                      </p>
                    </div>
                    <div className="mt-2">
                      <Link href={`/courses/${course._id.toString()}/learn`}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 px-6 font-semibold shadow-sm">
                          <PlayCircle className="w-4 h-4 mr-2" /> Continue Learning
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
