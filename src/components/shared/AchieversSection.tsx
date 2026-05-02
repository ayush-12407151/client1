"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Sparkles, UserPlus } from "lucide-react";

export const AchieversSection = () => {
  const [achievers, setAchievers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievers();
  }, []);

  const fetchAchievers = async () => {
    try {
      const res = await fetch("/api/achievers");
      if (res.ok) {
        const data = await res.json();
        // Take top 5 recent achievers to fit the grid with the motivational card
        setAchievers(data.slice(0, 5));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (achievers.length === 0) return null;

  return (
    <section className="w-full py-20 md:py-28 bg-slate-900 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-4">
              <Trophy className="w-4 h-4" /> OUR ACHIEVERS
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Dreams Turned Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Reality.</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg">Meet the top performers who trusted Modern Study Center and conquered the toughest exams in India.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/achievers" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              View All Hall of Fame <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Marquee Container */}
        <div className="relative flex overflow-hidden py-10 w-full group">
          {/* Left and Right Fade Overlays */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-slate-900 to-transparent z-30 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-slate-900 to-transparent z-30 pointer-events-none" />
          
          <motion.div
            className="flex gap-6 pr-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
          >
            {/* We render the list twice to create a seamless infinite scroll loop */}
            {[...achievers, ...achievers].map((achiever, i) => (
              <div
                key={`${achiever._id}-${i}`}
                className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 w-80 md:w-96 flex-shrink-0 hover:scale-[1.02] hover:z-40"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-60 pointer-events-none" />
                <img 
                  src={achiever.imageUrl} 
                  alt={achiever.name} 
                  className="w-full h-80 object-cover object-top transition-transform duration-500 ease-out"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  {achiever.badge && (
                    <span className="bg-amber-500 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                      {achiever.badge}
                    </span>
                  )}
                  <span className="bg-slate-900/80 backdrop-blur text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-700 w-fit">
                    {achiever.year}
                  </span>
                </div>

                {/* Content Box */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-20">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{achiever.name}</h3>
                      <p className="text-sm font-medium text-indigo-400">{achiever.exam} • Class {achiever.className}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-0.5 uppercase tracking-wider font-bold">Score / Rank</p>
                      <p className="text-lg font-black text-amber-400">{achiever.score}</p>
                    </div>
                  </div>
                  {achiever.message && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-300 italic">"{achiever.message}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Motivational Section Below Marquee */}
        <div className="mt-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-md border border-indigo-500/30 rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center justify-between p-8 md:p-12 group hover:border-indigo-400/60 hover:bg-indigo-600/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            
            <div className="flex items-center gap-6 mb-6 sm:mb-0 relative z-10">
              <div className="w-16 h-16 bg-indigo-900/50 rounded-full border-2 border-dashed border-indigo-400/50 flex items-center justify-center group-hover:border-indigo-300 transition-colors flex-shrink-0">
                <UserPlus className="w-8 h-8 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                  You could be the next achiever 🚀
                </h3>
                <p className="text-indigo-200 text-sm">
                  Join our community and start your journey towards excellence today.
                </p>
              </div>
            </div>
            
            <Link 
              href="/register" 
              className="relative z-10 whitespace-nowrap bg-white text-indigo-900 px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all flex items-center gap-2"
            >
              Start Your Journey <Sparkles className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
