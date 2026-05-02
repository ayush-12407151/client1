"use client";

import { useEffect, useState } from "react";
import { Trophy, Clock, Medal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminQuizLeaderboard() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardLoading, setBoardLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/quizzes");
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data);
          if (data.length > 0) {
            setSelectedQuizId(data[0]._id);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (!selectedQuizId) return;

    const fetchLeaderboard = async () => {
      setBoardLoading(true);
      try {
        const res = await fetch(`/api/quizzes/${selectedQuizId}/leaderboard`);
        if (res.ok) {
          const data = await res.json();
          // Take top 5 for the dashboard
          setLeaderboard(data.leaderboard.slice(0, 5));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setBoardLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedQuizId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-300";
    if (rank === 3) return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  if (loading) return null;

  return (
    <Card className="border-slate-200 shadow-sm flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-indigo-600" /> Quiz Leaderboard
        </CardTitle>
        <select
          className="text-sm border-gray-200 rounded-md py-1.5 pl-3 pr-8 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm bg-gray-50"
          value={selectedQuizId}
          onChange={(e) => setSelectedQuizId(e.target.value)}
        >
          <option value="" disabled>Select a quiz...</option>
          {quizzes.map((q) => (
            <option key={q._id} value={q._id}>{q.title}</option>
          ))}
        </select>
      </CardHeader>
      <CardContent className="flex-1">
        {boardLoading ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500 py-10">Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500 italic py-10">No attempts yet.</div>
        ) : (
          <div className="space-y-4 mt-2">
            {leaderboard.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold border text-sm ${getRankStyle(entry.rank)}`}>
                    {entry.rank === 1 ? <Medal className="w-4 h-4 text-yellow-600" /> : entry.rank}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{entry.user?.name || "Unknown"}</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3" /> {formatTime(entry.timeTaken)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    {entry.score} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
