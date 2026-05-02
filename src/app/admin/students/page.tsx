"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, Edit, Trash2, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Student {
  _id: string;
  name: string;
  email: string;
  className: string;
  isEnrolled: boolean;
  monthlyFee: number;
  admissionDate: string;
}

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/admin/students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEnrollment = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnrolled: !currentStatus }),
      });
      if (res.ok) {
        setStudents(students.map((s) => (s._id === id ? { ...s, isEnrolled: !currentStatus } : s)));
      }
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents(students.filter((s) => s._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete student");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> Manage Students
          </h2>
          <p className="text-slate-500 mt-1">View, edit, and track fees for all registered students.</p>
        </div>
        <Link href="/admin/students/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" /> Add Student
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Monthly Fee</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{student.name}</div>
                    <div className="text-slate-500 text-xs">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{student.className || "N/A"}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">₹{student.monthlyFee}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleEnrollment(student._id, student.isEnrolled)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        student.isEnrolled ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                      }`}
                    >
                      {student.isEnrolled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {student.isEnrolled ? "Enrolled" : "Blocked"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/students/${student._id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                          <Edit className="w-4 h-4 mr-1" /> Edit / Pay
                        </Button>
                      </Link>
                      <button onClick={() => deleteStudent(student._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No students registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
