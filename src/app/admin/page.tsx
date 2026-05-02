import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user.model";
import { Course } from "@/lib/models/course.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, GraduationCap, Activity } from "lucide-react";

export default async function AdminDashboard() {
  await connectToDatabase();

  // Fetch actual data
  const students = await User.find({ role: "STUDENT" }).lean();
  const totalStudents = students.length;
  
  const activeCourses = await Course.countDocuments({ isPublished: true });
  const facultyMembers = await User.countDocuments({ role: "INSTRUCTOR" });

  // Calculate Total Revenue from all fee payments
  let totalRevenue = 0;
  students.forEach((student: any) => {
    if (student.feePayments && student.feePayments.length > 0) {
      student.feePayments.forEach((payment: any) => {
        totalRevenue += payment.amount || 0;
      });
    }
  });

  // Format recent enrollments
  const recentEnrollments = students
    .filter((s: any) => s.admissionDate)
    .sort((a: any, b: any) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
    .slice(0, 5)
    .map((s: any) => ({
      name: s.name,
      email: s.email,
      course: s.className || "Unassigned",
      amount: `₹${s.monthlyFee || 0}`,
      time: new Date(s.admissionDate).toLocaleDateString(),
    }));

  const topCourses = [
    { name: "JEE Advanced – Complete Physics", students: 4200, revenue: "₹20,99,800", growth: "+18%" },
    { name: "NEET – Biology Masterclass", students: 3800, revenue: "₹15,19,200", growth: "+24%" },
    { name: "Class 12 CBSE – Mathematics", students: 2900, revenue: "₹5,79,100", growth: "+12%" },
    { name: "JEE Mains Crash Course 2026", students: 2100, revenue: "₹5,24,790", growth: "+45%" },
  ];



      <div className="grid gap-6 lg:grid-cols-5">
        {/* Revenue Chart */}
        <Card className="lg:col-span-3 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600" /> Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-[240px]">
              {monthlyRevenue.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-indigo-100 rounded-t-md relative overflow-hidden" style={{ height: `${m.value * 2.2}px` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{m.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEnrollments.map((e, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">{e.name.split(" ").map(n => n[0]).join("")}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{e.name}</p>
                    <p className="text-xs text-slate-400">{e.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{e.amount}</p>
                  <p className="text-xs text-slate-400">{e.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Courses Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-600" /> Top Performing Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="text-left py-3 px-4 font-semibold">Course</th>
                  <th className="text-right py-3 px-4 font-semibold">Students</th>
                  <th className="text-right py-3 px-4 font-semibold">Revenue</th>
                  <th className="text-right py-3 px-4 font-semibold">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((c, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-4 px-4 text-right text-slate-600">{c.students.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-900">{c.revenue}</td>
                    <td className="py-4 px-4 text-right"><span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md text-xs">{c.growth}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
