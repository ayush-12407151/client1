"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AchieversPage() {
  const [achievers, setAchievers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [exam, setExam] = useState("");

  useEffect(() => {
    fetchAchievers();
  }, [year, exam]);

  const fetchAchievers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (exam) params.append("exam", exam);
      
      const res = await fetch(`/api/achievers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAchievers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievers = achievers.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.score.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full text-indigo-600 mb-2"
          >
            <Trophy className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Wall of Excellence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            Celebrating the extraordinary hard work and success of our students. You could be next.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or rank..." 
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition bg-slate-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative w-full md:w-48">
              <select 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 appearance-none bg-slate-50 font-medium text-slate-700"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">All Years</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
              <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative w-full md:w-48">
              <select 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 appearance-none bg-slate-50 font-medium text-slate-700"
                value={exam}
                onChange={(e) => setExam(e.target.value)}
              >
                <option value="">All Exams</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="JEE Main">JEE Main</option>
                <option value="NEET">NEET</option>
                <option value="Boards">Boards</option>
              </select>
              <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading achievers...</p>
          </div>
        ) : filteredAchievers.length === 0 ? (
          <div className="bg-white py-20 text-center rounded-2xl border border-slate-200 shadow-sm">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No achievers found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAchievers.map((achiever, i) => (
              <motion.div
                key={achiever._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 group transition-all duration-300 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={achiever.imageUrl} 
                    alt={achiever.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
                      {achiever.year}
                    </span>
                  </div>
                  {achiever.badge && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
                      <span className="text-amber-400 text-sm font-black tracking-wide drop-shadow-md">
                        {achiever.badge}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{achiever.name}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">{achiever.exam} • Class {achiever.className}</p>
                  
                  <div className="mt-auto bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Score/Rank</span>
                    <span className="text-lg font-black text-indigo-700">{achiever.score}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
