"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Video, FileText, ClipboardList, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function FreeMaterialPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/free-material");
      return;
    }
    if (status === "authenticated") {
      fetchMaterials();
    }
  }, [status]);

  const fetchMaterials = async () => {
    try {
      const url = filter === "all" ? "/api/study-material" : `/api/study-material?type=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      fetchMaterials();
    }
  }, [filter]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  const typeIcons: any = {
    video: <Video className="w-5 h-5" />,
    notes: <FileText className="w-5 h-5" />,
    assignment: <ClipboardList className="w-5 h-5" />,
  };

  const typeColors: any = {
    video: "bg-red-50 text-red-600 border-red-100",
    notes: "bg-blue-50 text-blue-600 border-blue-100",
    assignment: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div className="text-center mb-10" {...fadeUp} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Free Study Material</h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">Access videos, notes and assignments shared by our educators — absolutely free.</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {[
            { key: "all", label: "All", icon: null },
            { key: "video", label: "Videos", icon: <Video className="w-4 h-4" /> },
            { key: "notes", label: "Notes", icon: <FileText className="w-4 h-4" /> },
            { key: "assignment", label: "Assignments", icon: <ClipboardList className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                filter === t.key ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-200"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : materials.length === 0 ? (
          <motion.div {...fadeUp} className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No materials yet</h3>
            <p className="text-slate-500">Our educators are preparing study material. Check back soon!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((m: any, i: number) => (
              <motion.div key={m._id} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${typeColors[m.type]}`}>
                    {typeIcons[m.type]}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{m.type}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{m.title}</h3>
                {m.description && <p className="text-slate-500 text-sm mb-4 line-clamp-2">{m.description}</p>}
                <a href={m.url} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full rounded-xl font-semibold border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {m.type === "video" ? "Watch Video" : m.type === "notes" ? "View Notes" : "View Assignment"}
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
