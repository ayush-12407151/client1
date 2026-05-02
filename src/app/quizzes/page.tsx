"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, CheckCircle } from "lucide-react";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/quizzes");
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading quizzes...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Quizzes</h1>
        <p className="text-slate-500 mt-2">Test your knowledge and track your progress.</p>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-gray-100">
          <p className="text-gray-500 text-lg">No quizzes are currently available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                      {quiz.category}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-3 line-clamp-2">{quiz.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{quiz.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center text-sm text-slate-500 font-medium gap-1">
                    <Clock className="w-4 h-4 text-slate-400" /> {quiz.duration} mins
                  </div>
                  <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    Attempts: {quiz.attemptCount || 0}/{quiz.maxAttempts || 1}
                  </div>
                </div>
              </div>
              
              {(quiz.attemptCount || 0) >= (quiz.maxAttempts || 1) ? (
                <Link href={`/quizzes/${quiz._id}/analysis`} className="block bg-green-50 hover:bg-green-600 hover:text-white transition-colors text-center py-3 font-semibold text-green-700 border-t border-green-200">
                  View Results →
                </Link>
              ) : (
                <Link href={`/quizzes/${quiz._id}`} className="block bg-slate-50 hover:bg-indigo-600 hover:text-white transition-colors text-center py-3 font-semibold text-slate-700 border-t border-slate-200">
                  Start Quiz →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
