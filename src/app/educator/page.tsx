"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Star, Users, Target, CheckCircle } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function EducatorPage() {
  const highlights = [
    { icon: <GraduationCap className="w-6 h-6" />, label: "3+ Years Experience", desc: "In competitive exam coaching" },
    { icon: <Users className="w-6 h-6" />, label: "5000+ Students", desc: "Trained successfully" },
    { icon: <Target className="w-6 h-6" />, label: "JEE & NEET Expert", desc: "Specialised in Physics & Mathematics" },
    { icon: <Star className="w-6 h-6" />, label: "4.9 Rating", desc: "Average student feedback" },
  ];

  const subjects = ["Physics", "Mathematics", "Chemistry", "CBSE Board Preparation", "JEE Main & Advanced", "NEET Physics"];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a0e27] via-[#111640] to-[#1a1050] py-20 relative overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-indigo-700/20 blur-[120px]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-indigo-400/30 shadow-2xl shadow-indigo-500/20">
                <img src="/educator.png" alt="Sachin Mishra" className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
            <motion.div className="text-center md:text-left" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <p className="text-indigo-400 font-bold text-sm tracking-widest uppercase mb-3">Lead Educator</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Sachin Mishra</h1>
              <p className="text-xl text-slate-400 max-w-xl leading-relaxed mb-6">
                Passionate educator with 3+ years of experience in coaching JEE, NEET and Board aspirants. Known for making complex topics simple and scoring-oriented.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-full text-sm font-medium">Physics Expert</span>
                <span className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-full text-sm font-medium">Mathematics</span>
                <span className="px-4 py-2 bg-amber-600/20 border border-amber-500/30 text-amber-300 rounded-full text-sm font-medium">JEE & NEET</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }} className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">{h.icon}</div>
                <h3 className="font-bold text-lg text-slate-900">{h.label}</h3>
                <p className="text-sm text-slate-500 mt-1">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">About Sachin Mishra</h2>
            <div className="prose prose-lg max-w-none text-slate-600 space-y-6">
              <p>
                Sachin Mishra is the founder and lead educator at Modern Study Center. With a deep passion for teaching and a strong academic background, he has been instrumental in shaping the careers of thousands of students across India.
              </p>
              <p>
                His teaching methodology focuses on conceptual clarity, problem-solving techniques, and exam-oriented strategies that have helped students achieve top ranks in JEE, NEET, and secure excellent percentages in Board examinations.
              </p>
              <p>
                Sachin believes in making quality education accessible to every student. His engaging teaching style, combined with real-world examples and interactive doubt sessions, ensures that students not only understand concepts but also develop a genuine love for learning.
              </p>
            </div>
          </motion.div>

          {/* Subjects */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="mt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Subjects & Expertise</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {subjects.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> {s}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
