import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, GraduationCap, Activity } from "lucide-react";
import AdminQuizLeaderboard from "@/components/admin/AdminQuizLeaderboard";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Revenue", value: "₹45,23,189", icon: <DollarSign className="h-5 w-5" />, change: "+20.1%", up: true, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { title: "Total Students", value: "23,500", icon: <Users className="h-5 w-5" />, change: "+12.5%", up: true, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { title: "Active Courses", value: "142", icon: <BookOpen className="h-5 w-5" />, change: "+8%", up: true, color: "bg-amber-50 text-amber-600 border-amber-100" },
    { title: "Faculty Members", value: "45", icon: <GraduationCap className="h-5 w-5" />, change: "+3", up: true, color: "bg-purple-50 text-purple-600 border-purple-100" },
  ];

  const recentEnrollments = [
    { name: "Aarav Sharma", email: "aarav@gmail.com", course: "JEE Advanced Physics", amount: "₹4,999", time: "2 min ago" },
    { name: "Priya Verma", email: "priya@gmail.com", course: "NEET Biology Complete", amount: "₹3,999", time: "15 min ago" },
    { name: "Rahul Gupta", email: "rahul@gmail.com", course: "Class 12 Maths", amount: "₹1,999", time: "1 hr ago" },
    { name: "Sneha Patel", email: "sneha@gmail.com", course: "JEE Mains Crash Course", amount: "₹2,499", time: "2 hrs ago" },
    { name: "Vikram Singh", email: "vikram@gmail.com", course: "NEET Chemistry", amount: "₹3,499", time: "3 hrs ago" },
  ];

  const topCourses = [
    { name: "JEE Advanced – Complete Physics", students: 4200, revenue: "₹20,99,800", growth: "+18%" },
    { name: "NEET – Biology Masterclass", students: 3800, revenue: "₹15,19,200", growth: "+24%" },
    { name: "Class 12 CBSE – Mathematics", students: 2900, revenue: "₹5,79,100", growth: "+12%" },
    { name: "JEE Mains Crash Course 2026", students: 2100, revenue: "₹5,24,790", growth: "+45%" },
  ];

  // Mock revenue data for bar chart visualization
  const monthlyRevenue = [
    { month: "Jul", value: 25 }, { month: "Aug", value: 38 }, { month: "Sep", value: 45 },
    { month: "Oct", value: 52 }, { month: "Nov", value: 61 }, { month: "Dec", value: 48 },
    { month: "Jan", value: 72 }, { month: "Feb", value: 68 }, { month: "Mar", value: 85 },
    { month: "Apr", value: 92 }, { month: "May", value: 78 }, { month: "Jun", value: 100 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Admin Dashboard</h2>
        <p className="text-slate-500 mt-1">Platform overview and key metrics.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className={`border ${stat.color.split(" ")[2]} shadow-none`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color.split(" ")[0]} flex items-center justify-center ${stat.color.split(" ")[1]}`}>{stat.icon}</div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? "text-emerald-600" : "text-red-500"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{stat.change}
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
