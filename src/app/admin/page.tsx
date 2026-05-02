import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user.model";
import { Course } from "@/lib/models/course.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, BookOpen, DollarSign, TrendingUp,
  ArrowUpRight, GraduationCap, Activity, IndianRupee
} from "lucide-react";

// CRITICAL: Force server-render on every request so data is always live
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectToDatabase();

  // Fetch all students with all fields
  const students = await User.find({ role: "STUDENT" })
    .sort({ createdAt: -1 })
    .lean();

  const totalStudents = students.length;
  const activeCourses = await Course.countDocuments({ isPublished: true });
  const facultyMembers = await User.countDocuments({ role: "INSTRUCTOR" });

  // ── Total Revenue: sum all feePayments across all students ──
  let totalRevenue = 0;
  students.forEach((student: any) => {
    (student.feePayments || []).forEach((p: any) => {
      totalRevenue += Number(p.amount) || 0;
    });
  });

  // ── Monthly Revenue chart: group feePayments by month ──
  const monthMap: Record<string, number> = {};
  students.forEach((student: any) => {
    (student.feePayments || []).forEach((p: any) => {
      const d = p.datePaid ? new Date(p.datePaid) : new Date();
      const key = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      monthMap[key] = (monthMap[key] || 0) + (Number(p.amount) || 0);
    });
  });

  // Sort months chronologically
  const sortedMonths = Object.entries(monthMap).sort(([a], [b]) => {
    const parse = (s: string) => new Date(`01 ${s}`).getTime();
    return parse(a) - parse(b);
  });

  const hasRealData = sortedMonths.length > 0;
  const maxVal = hasRealData ? Math.max(...sortedMonths.map(([, v]) => v)) : 100;

  const monthlyRevenue = hasRealData
    ? sortedMonths.map(([month, value]) => ({ month, value, pct: Math.max(8, (value / maxVal) * 100) }))
    : [
        { month: "Jul", value: 0, pct: 25 }, { month: "Aug", value: 0, pct: 38 },
        { month: "Sep", value: 0, pct: 45 }, { month: "Oct", value: 0, pct: 52 },
        { month: "Nov", value: 0, pct: 61 }, { month: "Dec", value: 0, pct: 48 },
        { month: "Jan", value: 0, pct: 72 }, { month: "Feb", value: 0, pct: 68 },
        { month: "Mar", value: 0, pct: 85 }, { month: "Apr", value: 0, pct: 92 },
        { month: "May", value: 0, pct: 78 }, { month: "Jun", value: 0, pct: 100 },
      ];

  // ── Recent Enrollments: latest 6 students by createdAt ──
  const recentEnrollments = students.slice(0, 6).map((s: any) => ({
    name: s.name,
    email: s.email,
    course: s.className ? `Class ${s.className}` : "Unassigned",
    amount: `₹${(s.monthlyFee || 0).toLocaleString("en-IN")}`,
    time: new Date(s.createdAt || s.admissionDate || Date.now()).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    }),
    isEnrolled: s.isEnrolled,
    image: s.image || "",
  }));

  // ── Fee summary per student for the "Top Students" table ──
  const studentFeeStats = students
    .map((s: any) => ({
      name: s.name,
      email: s.email,
      image: s.image || "",
      className: s.className || "—",
      monthlyFee: s.monthlyFee || 0,
      totalPaid: (s.feePayments || []).reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0),
      paymentCount: (s.feePayments || []).length,
      isEnrolled: s.isEnrolled,
    }))
    .filter((s) => s.totalPaid > 0)
    .sort((a, b) => b.totalPaid - a.totalPaid)
    .slice(0, 5);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500 mt-1">Live platform metrics — updates on every page load.</p>
        </div>
        {!hasRealData && (
          <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg font-medium">
            📊 No fee payments yet — chart shows sample shape
          </span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            icon: <IndianRupee className="h-5 w-5" />,
            sub: `from ${students.reduce((s: number, u: any) => s + (u.feePayments?.length || 0), 0)} payments`,
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
          },
          {
            title: "Total Students",
            value: totalStudents.toString(),
            icon: <Users className="h-5 w-5" />,
            sub: `${students.filter((s: any) => s.isEnrolled).length} enrolled`,
            color: "bg-indigo-50 text-indigo-600 border-indigo-100",
          },
          {
            title: "Active Courses",
            value: activeCourses.toString(),
            icon: <BookOpen className="h-5 w-5" />,
            sub: "published courses",
            color: "bg-amber-50 text-amber-600 border-amber-100",
          },
          {
            title: "Faculty Members",
            value: facultyMembers.toString(),
            icon: <GraduationCap className="h-5 w-5" />,
            sub: "instructors",
            color: "bg-purple-50 text-purple-600 border-purple-100",
          },
        ].map((stat, i) => (
          <Card key={i} className={`border ${stat.color.split(" ")[2]} shadow-none`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color.split(" ")[0]} flex items-center justify-center ${stat.color.split(" ")[1]}`}>
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <ArrowUpRight className="w-3 h-3" /> Live
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{stat.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Monthly Revenue Bar Chart */}
        <Card className="lg:col-span-3 border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Monthly Revenue
              {hasRealData && (
                <span className="ml-auto text-xs font-normal text-slate-400">
                  Total: ₹{totalRevenue.toLocaleString("en-IN")}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1.5 h-[220px]">
              {monthlyRevenue.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full flex flex-col justify-end" style={{ height: "192px" }}>
                    {/* Tooltip */}
                    {hasRealData && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        ₹{m.value.toLocaleString("en-IN")}
                      </div>
                    )}
                    <div
                      className="w-full rounded-t-md relative overflow-hidden transition-all"
                      style={{ height: `${m.pct * 1.92}px` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-violet-600 group-hover:to-indigo-400 transition-colors rounded-t-md" />
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">{m.month}</span>
                </div>
              ))}
            </div>
            {!hasRealData && (
              <p className="text-center text-xs text-slate-400 mt-2">Add fee payments to students to see real revenue data here.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Recent Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEnrollments.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No students registered yet.</p>
            ) : (
              recentEnrollments.map((e, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {e.image ? (
                      <img src={e.image} alt={e.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {getInitials(e.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{e.name}</p>
                      <p className="text-xs text-slate-400">{e.course}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-600">{e.amount}<span className="text-slate-400 font-normal">/mo</span></p>
                    <div className="flex items-center justify-end gap-1">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${e.isEnrolled ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <p className="text-[10px] text-slate-400">{e.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Fee Payers Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Top Fee Paying Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studentFeeStats.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              No fee payments recorded yet. Go to{" "}
              <a href="/admin/students" className="text-indigo-600 underline">Manage Students</a>{" "}
              to add payments.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="text-left py-3 px-4 font-semibold">Student</th>
                    <th className="text-left py-3 px-4 font-semibold">Class</th>
                    <th className="text-right py-3 px-4 font-semibold">Monthly Fee</th>
                    <th className="text-right py-3 px-4 font-semibold">Total Paid</th>
                    <th className="text-right py-3 px-4 font-semibold">Payments</th>
                    <th className="text-right py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentFeeStats.map((s, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {s.image ? (
                            <img src={s.image} alt={s.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                              {getInitials(s.name)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{s.name}</p>
                            <p className="text-xs text-slate-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{s.className}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-700">₹{s.monthlyFee.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600">₹{s.totalPaid.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{s.paymentCount} {s.paymentCount === 1 ? "month" : "months"}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${s.isEnrolled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {s.isEnrolled ? "Enrolled" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
