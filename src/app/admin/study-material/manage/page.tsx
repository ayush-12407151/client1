"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, FileText, ClipboardList, Trash2, Pencil, X, Loader2, CheckCircle, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminManageMaterialPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editItem, setEditItem] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", url: "", category: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/study-material" : `/api/study-material?type=${filter}`;
      const res = await fetch(url);
      if (res.ok) setMaterials(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterials(); }, [filter]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/study-material", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMaterials(materials.filter((m) => m._id !== id));
        showToast("Deleted successfully");
      }
    } catch (err) { alert("Delete failed"); }
    finally { setDeleting(null); }
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setEditForm({ title: item.title, description: item.description || "", url: item.url, category: item.category || "General" });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/study-material", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editItem._id, ...editForm }),
      });
      if (res.ok) {
        const data = await res.json();
        setMaterials(materials.map((m) => m._id === editItem._id ? data.material : m));
        setEditItem(null);
        showToast("Updated successfully");
      }
    } catch (err) { alert("Update failed"); }
    finally { setSaving(false); }
  };

  const typeIcons: any = { video: <Video className="w-4 h-4" />, notes: <FileText className="w-4 h-4" />, assignment: <ClipboardList className="w-4 h-4" /> };
  const typeColors: any = { video: "bg-red-50 text-red-600", notes: "bg-blue-50 text-blue-600", assignment: "bg-amber-50 text-amber-600" };

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center gap-2 text-emerald-700 font-medium shadow-lg">
            <CheckCircle className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Manage Study Material</h2>
          <p className="text-slate-500 mt-1">Edit or delete existing videos, notes and assignments.</p>
        </div>
        <Link href="/admin/study-material">
          <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold gap-2"><Plus className="w-4 h-4" /> Add New</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {[{ key: "all", label: "All" }, { key: "video", label: "Videos" }, { key: "notes", label: "Notes" }, { key: "assignment", label: "Assignments" }].map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === t.key ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-indigo-600" /></div>
      ) : materials.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No materials found. <Link href="/admin/study-material" className="text-indigo-600 font-semibold hover:underline">Add some →</Link></div>
      ) : (
        <div className="space-y-3">
          {materials.map((m) => (
            <motion.div key={m._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white border border-slate-100 rounded-xl p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[m.type]}`}>{typeIcons[m.type]}</div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{m.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="uppercase font-bold tracking-wider">{m.type}</span>
                    <span>•</span>
                    <span>{m.category}</span>
                    <a href={m.url} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Link</a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200" onClick={() => openEdit(m)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  disabled={deleting === m._id} onClick={() => handleDelete(m._id)}>
                  {deleting === m._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditItem(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Edit Material</h3>
                <button onClick={() => setEditItem(null)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">URL / Link</label>
                  <input type="url" value={editForm.url} onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                  <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>General</option><option>JEE</option><option>NEET</option><option>Boards</option>
                    <option>Physics</option><option>Chemistry</option><option>Mathematics</option><option>Biology</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setEditItem(null)}>Cancel</Button>
                  <Button className="flex-1 rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700 font-bold" disabled={saving} onClick={handleSave}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
