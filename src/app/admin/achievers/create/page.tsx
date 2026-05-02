"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, X } from "lucide-react";

export default function AddAchieverPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    className: "12th",
    exam: "JEE Advanced",
    score: "",
    year: new Date().getFullYear().toString(),
    imageUrl: "",
    message: "",
    badge: "",
    isVisible: true,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, imageUrl: data.url });
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert("Please upload a student photo.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/achievers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/achievers");
      } else {
        alert("Failed to add achiever");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding achiever");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/achievers" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Achiever</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student Photo *</label>
            {formData.imageUrl ? (
              <div className="relative inline-block">
                <img src={formData.imageUrl} alt="Student" className="w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm" />
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: "" })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition relative max-w-sm">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <UploadCloud className={`w-10 h-10 ${uploading ? 'text-indigo-600 animate-bounce' : 'text-gray-400'}`} />
                  <span className="font-medium text-indigo-600">
                    {uploading ? "Uploading..." : "Click or drag to upload photo"}
                  </span>
                  <span className="text-xs text-gray-500">1:1 Aspect ratio recommended</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text" required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Priya Sharma"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
              <input
                type="text" required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 12th, Dropper"
                value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
              <input
                type="text" required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. JEE Advanced, NEET"
                value={formData.exam} onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score / Rank *</label>
              <input
                type="text" required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. AIR 156, 695/720"
                value={formData.score} onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="text" required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 2025"
                value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge (Optional)</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. State Topper, Distinction"
                value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Message (Optional)</label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Motivational quote from the student..."
              rows={2}
              value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          
          <label className="flex items-center pt-2 border-t border-gray-100">
            <input
              type="checkbox"
              className="rounded text-indigo-600 focus:ring-indigo-500 h-5 w-5"
              checked={formData.isVisible}
              onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
            />
            <span className="ml-3 text-sm font-medium text-gray-900">Visible on Website</span>
          </label>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Achiever"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
