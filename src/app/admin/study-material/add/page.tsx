"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, FileText, ClipboardList, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

function AddMaterialForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "video";
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", url: "", category: "General" });

  const typeConfig: any = {
    video: { label: "Video", icon: <Video className="w-6 h-6" />, color: "text-red-600 bg-red-50", placeholder: "https://www.youtube.com/watch?v=..." },
    notes: { label: "Notes", icon: <FileText className="w-6 h-6" />, color: "text-blue-600 bg-blue-50", placeholder: "https://drive.google.com/..." },
    assignment: { label: "Assignment", icon: <ClipboardList className="w-6 h-6" />, color: "text-amber-600 bg-amber-50", placeholder: "https://drive.google.com/..." },
  };

  const config = typeConfig[type] || typeConfig.video;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/study-material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setSuccess(true);
      setForm({ title: "", description: "", url: "", category: "General" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/admin/study-material")} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Add {config.label}</h2>
          <p className="text-slate-500 mt-0.5">Fill in the details below to add a new {type}.</p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-700 font-medium">
          <CheckCircle className="w-5 h-5" /> Material added successfully!
        </div>
      )}

      <Card className="border-slate-200 shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color}`}>{config.icon}</div>
            Add New {config.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
              <input
                type="text" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder={`Enter ${type} title`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Brief description..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">URL / Link *</label>
              <input
                type="url" required value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder={config.placeholder}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option>General</option>
                <option>JEE</option>
                <option>NEET</option>
                <option>Boards</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
                <option>Biology</option>
              </select>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-base">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? "Adding..." : `Add ${config.label}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AddMaterialPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>}>
      <AddMaterialForm />
    </Suspense>
  );
}
