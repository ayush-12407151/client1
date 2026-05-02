"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    fatherName: "",
    motherName: "",
    schoolName: "",
    className: "",
    monthlyFee: 0,
    isEnrolled: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/students");
      } else {
        const error = await res.json();
        alert(error.message || "Failed to create student");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/students" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Manually Add Student</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
        {/* Basic Auth Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Authentication</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input name="name" required value={formData.name} onChange={handleChange} placeholder="Student Name" />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="student@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Temporary Password *</Label>
              <Input name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Student Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Father's Name</Label>
              <Input name="fatherName" value={formData.fatherName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Mother's Name</Label>
              <Input name="motherName" value={formData.motherName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>School / College</Label>
              <Input name="schoolName" value={formData.schoolName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <select name="className" value={formData.className} onChange={handleChange} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm">
                <option value="">Select Class</option>
                <option value="6th">Class 6th</option>
                <option value="7th">Class 7th</option>
                <option value="8th">Class 8th</option>
                <option value="9th">Class 9th</option>
                <option value="10th">Class 10th</option>
                <option value="11th">Class 11th</option>
                <option value="12th">Class 12th</option>
                <option value="Dropper">Dropper</option>
              </select>
            </div>
          </div>
        </div>

        {/* Administrative */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Administrative & Fees</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Monthly Fee (₹)</Label>
              <Input name="monthlyFee" type="number" min="0" value={formData.monthlyFee} onChange={handleChange} />
            </div>
            <div className="flex items-end pb-2">
              <Label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isEnrolled" checked={formData.isEnrolled} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="font-semibold text-slate-700">Enrolled (Active Account)</span>
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Student
          </Button>
        </div>
      </form>
    </div>
  );
}
