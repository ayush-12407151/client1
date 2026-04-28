"use client";

import { motion } from "framer-motion";
import { Clock, BookOpen, Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LearnClient({ course }: { course: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4">
      <motion.div
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Animated Icon */}
        <motion.div
          className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-200"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Clock className="w-14 h-14 text-white" />
        </motion.div>

        <motion.h1
          className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Coming Soon! 🚀
        </motion.h1>

        <motion.p
          className="text-slate-500 text-lg leading-relaxed mb-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          We're preparing amazing content for <span className="font-bold text-slate-700">{course?.title || "this course"}</span>. Our educators are recording high-quality lessons just for you.
        </motion.p>

        {/* Info Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <BookOpen className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Course Content</p>
            <p className="text-xs text-slate-400 mt-1">Being prepared by experts</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <Bell className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Get Notified</p>
            <p className="text-xs text-slate-400 mt-1">We'll update you when ready</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl px-6 h-12 font-semibold gap-2 border-slate-200">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
          <Link href="/free-material">
            <Button className="rounded-xl px-6 h-12 font-semibold bg-indigo-600 hover:bg-indigo-700 gap-2">
              <BookOpen className="w-4 h-4" /> Browse Free Material
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
