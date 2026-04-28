"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Video, FileText, ClipboardList } from "lucide-react";

export default function AdminStudyMaterialPage() {
  const cards = [
    {
      title: "Upload Video",
      desc: "Add YouTube video links for students to watch. Organize by subject and topic.",
      icon: <Video className="w-10 h-10" />,
      href: "/admin/study-material/add?type=video",
      gradient: "from-red-500 to-rose-600",
      shadow: "shadow-red-200",
      img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Upload Notes",
      desc: "Share study notes, PDFs and reference material with your students.",
      icon: <FileText className="w-10 h-10" />,
      href: "/admin/study-material/add?type=notes",
      gradient: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-200",
      img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Upload Assignment",
      desc: "Create and upload assignments, worksheets and practice papers.",
      icon: <ClipboardList className="w-10 h-10" />,
      href: "/admin/study-material/add?type=assignment",
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-200",
      img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Study Material</h2>
          <p className="text-slate-500 mt-1">Add videos, notes and assignments for your students.</p>
        </div>
        <Link href="/admin/study-material/manage">
          <div className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors cursor-pointer">
            Manage Existing →
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.15, type: "spring", stiffness: 100 }}
          >
            <Link href={card.href}>
              <div className={`group cursor-pointer bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg ${card.shadow} hover:shadow-2xl transition-all hover:-translate-y-2`}>
                <div className="h-44 overflow-hidden relative">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient} opacity-60`} />
                  <div className="absolute bottom-4 left-4 text-white">{card.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{card.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                  <div className="mt-4 text-indigo-600 font-semibold text-sm flex items-center gap-1">
                    Click to Add →
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
