"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fatherName: "",
    motherName: "",
    schoolName: "",
    className: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setLoading(true);

    try {
      // Create a quick API endpoint to update self profile
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h1>
          <p className="text-slate-500">Just a few more details to get you started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Father's Name</Label>
            <Input name="fatherName" value={formData.fatherName} onChange={handleChange} required className="h-11 rounded-xl" />
          </div>
          
          <div className="space-y-2">
            <Label>Mother's Name</Label>
            <Input name="motherName" value={formData.motherName} onChange={handleChange} required className="h-11 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label>School / College Name</Label>
            <Input name="schoolName" value={formData.schoolName} onChange={handleChange} required className="h-11 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label>Class</Label>
            <select name="className" value={formData.className} onChange={handleChange} required className="w-full h-11 px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm">
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

          <Button type="submit" disabled={loading} className="w-full h-11 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Profile <ArrowRight className="ml-2 w-4 h-4" /></>}
          </Button>
        </form>
      </div>
    </div>
  );
}
