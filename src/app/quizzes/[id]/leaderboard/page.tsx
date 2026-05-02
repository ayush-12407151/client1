"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Trophy, Medal, ArrowLeft, Clock, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LeaderboardPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLeaderboard = async () => {
    try {
      const [quizRes, boardRes] = await Promise.all([
        fetch(`/api/quizzes/${id}`),
        fetch(`/api/quizzes/${id}/leaderboard`)
      ]);
      
      if (quizRes.ok) {
        const data = await quizRes.json();
        setQuiz(data.quiz);
      }
      
      if (boardRes.ok) {
        const data = await boardRes.json();
        setLeaderboard(data.leaderboard);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Polling every 10 seconds for real-time feel
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Leaderboard...</div>;

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-300";
    if (rank === 3) return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-white text-gray-700 border-gray-100";
  };

  const myRank = leaderboard.find(entry => entry.user?._id === (session?.user as any)?.id)?.rank;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <Link href="/quizzes" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-4 py-2 rounded-full">
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
          <RefreshCw className="w-3 h-3 animate-spin-slow" /> 
          Live (Updated: {lastUpdated.toLocaleTimeString()})
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full shadow-inner mb-2">
          <Trophy className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Leaderboard</h1>
        <p className="text-lg text-gray-500 font-medium">{quiz?.title}</p>
        
        {myRank && (
          <div className="mt-4 inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full shadow-lg font-bold">
            Your Rank: #{myRank}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 font-semibold text-gray-500 uppercase tracking-wider text-sm">Rank</th>
              <th className="py-4 px-6 font-semibold text-gray-500 uppercase tracking-wider text-sm">Student</th>
              <th className="py-4 px-6 font-semibold text-gray-500 uppercase tracking-wider text-sm text-center">Score</th>
              <th className="py-4 px-6 font-semibold text-gray-500 uppercase tracking-wider text-sm text-right">Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500 italic">
                  No evaluated attempts yet. Check back later!
                </td>
              </tr>
            ) : (
              leaderboard.map((entry) => (
                <tr 
                  key={entry.id} 
                  className={`border-b last:border-0 transition-colors ${entry.user?._id === (session?.user as any)?.id ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}`}
                >
                  <td className="py-4 px-6">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold border ${getRankStyle(entry.rank)}`}>
                      {entry.rank === 1 ? <Medal className="w-5 h-5 text-yellow-600" /> : entry.rank}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                        {entry.user?.name?.charAt(0) || '?'}
                      </div>
                      <span className="font-semibold text-gray-900">{entry.user?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-lg font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                      {entry.score}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 text-gray-500 text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      {formatTime(entry.timeTaken)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
