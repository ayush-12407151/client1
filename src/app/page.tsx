"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  PlayCircle, Target, LibraryBig, Trophy, Zap,
  GraduationCap, Star, BookOpen, CheckCircle, ArrowRight,
  Phone, MessageCircle, Award, TrendingUp,
  ChevronRight, Sparkles, Video
} from "lucide-react";
import { useState } from "react";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" } };

const categories = [
  { label: "Class 6–8", color: "from-cyan-500 to-blue-600", icon: <BookOpen className="w-6 h-6" /> },
  { label: "Class 9–10", color: "from-violet-500 to-purple-600", icon: <GraduationCap className="w-6 h-6" /> },
  { label: "Class 11–12", color: "from-amber-500 to-orange-600", icon: <LibraryBig className="w-6 h-6" /> },
  { label: "JEE Prep", color: "from-rose-500 to-pink-600", icon: <Target className="w-6 h-6" /> },
  { label: "NEET Prep", color: "from-emerald-500 to-green-600", icon: <Zap className="w-6 h-6" /> },
];

const features = [
  { icon: <Video className="w-7 h-7" />, title: "Live & Recorded Classes", desc: "Attend live interactive sessions or watch at your own pace with lifetime access." },
  { icon: <Target className="w-7 h-7" />, title: "All India Test Series", desc: "Compete with lakhs of aspirants. Get detailed analytics & rank prediction." },
  { icon: <LibraryBig className="w-7 h-7" />, title: "Chapter-wise PYQs", desc: "10+ years of Previous Year Questions with step-by-step video solutions." },
  { icon: <Award className="w-7 h-7" />, title: "Expert Faculty", desc: "Learn from IIT/AIIMS alumni with 10+ years of teaching experience." },
  { icon: <TrendingUp className="w-7 h-7" />, title: "Performance Analytics", desc: "AI-powered progress tracking, weak-area detection and personalised study plans." },
  { icon: <MessageCircle className="w-7 h-7" />, title: "24/7 Doubt Support", desc: "Get your doubts resolved instantly through chat, video calls and forums." },
];

const testimonials = [
  { name: "Priya Sharma", role: "AIR 156 – JEE Advanced 2025", text: "Modern Study Center transformed my preparation. The test series and faculty mentorship were game-changers.", avatar: "PS" },
  { name: "Rahul Verma", role: "NEET 2025 – 695/720", text: "The NCERT-aligned content and daily practice sessions helped me score beyond my expectations.", avatar: "RV" },
  { name: "Ananya Gupta", role: "CBSE Class 12 – 98.4%", text: "The board exam crash course was perfectly structured. I could revise everything in just 45 days.", avatar: "AG" },
];

const results = [
  { number: "1,200+", label: "IIT Selections" },
  { number: "3,500+", label: "NEET Qualifiers" },
  { number: "15,000+", label: "90%+ in Boards" },
  { number: "50,000+", label: "Happy Students" },
];

const faqs = [
  { q: "Who can join Modern Study Center?", a: "Students from Class 6 to 12, JEE and NEET aspirants. We have specialized batches for every level." },
  { q: "Are the classes live or recorded?", a: "Both! We offer live interactive classes and recorded lectures with lifetime access." },
  { q: "What is the refund policy?", a: "We offer a 7-day no-questions-asked refund policy on all courses." },
  { q: "Do you provide study material?", a: "Yes, comprehensive study material, DPPs, previous year questions and mock tests are included." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col flex-1 items-center bg-white font-sans overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="w-full relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#111640] to-[#1a1050]">
        {/* Static background — no JS animations */}
        <div className="absolute -top-[30%] -left-[15%] w-[55%] h-[55%] rounded-full bg-indigo-700/20 blur-[140px] pointer-events-none" />
        <div className="absolute top-[25%] -right-[10%] w-[45%] h-[55%] rounded-full bg-purple-700/15 blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold mb-8 backdrop-blur-md" initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="tracking-wide uppercase text-xs">India's Fastest Growing EdTech Platform</span>
            </motion.div>

            <motion.h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
              Your Dream College<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Starts Here.</span>
            </motion.h1>

            <motion.p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5,delay:0.15}}>
              Structured courses for Class 6–12, JEE & NEET by India's top educators. Live classes, test series, doubt support & more.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.25}}>
              <Link href="/register"><Button size="lg" className="h-14 px-10 text-base bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold">Start Learning Free</Button></Link>
              <Link href="/courses"><Button variant="outline" size="lg" className="h-14 px-10 text-base border-slate-600 bg-white/5 hover:bg-white/10 text-white rounded-xl">Explore Courses <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
            </motion.div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {results.map((r,i)=>(<div key={i} className="text-center"><h4 className="text-2xl md:text-3xl font-bold text-white">{r.number}</h4><p className="text-xs text-slate-500 font-medium mt-1">{r.label}</p></div>))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LEARNING PATHS ═══ */}
      <section className="w-full py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" {...fadeUp} transition={{duration:0.4}}>
            <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-3">Learning Paths</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Choose Your Journey</h2>
            <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">Specialised courses designed for every academic stage.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((c,i)=>(
              <motion.div key={i} {...fadeUp} transition={{duration:0.3,delay:i*0.05}} className="group cursor-pointer">
                <div className={`bg-gradient-to-br ${c.color} rounded-2xl p-6 text-white text-center shadow-lg group-hover:shadow-2xl transition-shadow`}>
                  <div className="mx-auto w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">{c.icon}</div>
                  <h3 className="font-bold text-lg">{c.label}</h3>
                  <p className="text-white/70 text-xs mt-1">View courses →</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="w-full py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeUp} transition={{duration:0.4}}>
            <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-3">Why Us</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Everything You Need to Succeed</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f,i)=>(
              <motion.div key={i} {...fadeUp} transition={{duration:0.4,delay:i*0.08}} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">{f.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="w-full py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeUp} transition={{duration:0.4}}>
            <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-3">Student Love</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Hear From Our Toppers</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t,i)=>(
              <motion.div key={i} {...fadeUp} transition={{duration:0.4,delay:i*0.1}} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl">
                <div className="flex items-center gap-1 text-amber-400 mb-4">{[...Array(5)].map((_,j)=><Star key={j} className="w-4 h-4 fill-current" />)}</div>
                <p className="text-slate-600 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">{t.avatar}</div>
                  <div><p className="font-bold text-slate-900 text-sm">{t.name}</p><p className="text-xs text-slate-500">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="w-full py-20 md:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" {...fadeUp} transition={{duration:0.4}}>
            <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-3">FAQs</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Have Questions?</h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((f,i)=>(
              <div key={i} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors">
                  {f.q}<ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${openFaq===i?"rotate-90":""}`}/>
                </button>
                {openFaq===i&&<div className="px-6 pb-5 text-slate-500 leading-relaxed">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="w-full py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <Sparkles className="w-10 h-10 text-amber-300 mx-auto mb-5" />
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Your Selection Starts Today</h2>
              <p className="text-indigo-200 text-lg max-w-xl mx-auto mb-8">Join 50,000+ students already preparing with India's most trusted educators.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register"><Button size="lg" className="h-14 px-10 text-base bg-white text-indigo-700 hover:bg-slate-100 font-bold rounded-xl shadow-xl">Enroll Now</Button></Link>
                <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer"><Button size="lg" className="h-14 px-10 text-base bg-indigo-800 text-white hover:bg-indigo-900 rounded-xl border border-indigo-400/30 font-bold"><Phone className="w-4 h-4 mr-2"/> Talk to Counsellor</Button></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
