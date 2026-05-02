"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";

export default function QuizAnalysisPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch(`/api/quizzes/${id}/analysis`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading analysis...</div>;
  if (!data) return <div className="p-10 text-center">No attempt found for this quiz.</div>;

  const { quiz, attempt, questions } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <Link href={`/quizzes/${id}/leaderboard`} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-4 py-2 rounded-full">
          <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
        </Link>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Quiz Analysis</h1>
        <p className="text-gray-500 mt-2">{quiz.title}</p>
        
        <div className="mt-6 flex justify-center gap-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Score</p>
            <p className="text-3xl font-bold text-indigo-600">{attempt.totalScore}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Status</p>
            <p className="text-lg font-bold text-gray-800 mt-1">{attempt.status.replace("_", " ")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q: any, idx: number) => {
          const studentAnsObj = attempt.answers.find((a: any) => a.questionId.toString() === q._id.toString());
          const studentSelected = studentAnsObj?.selectedOptions || [];
          
          let isCorrect = false;
          let isWrong = false;

          if (q.type !== "SUBJECTIVE") {
            const correctOptions = q.options.filter((o: any) => o.isCorrect).map((o: any) => o._id.toString());
            const isFullyCorrect = correctOptions.length === studentSelected.length && correctOptions.every((optId: string) => studentSelected.includes(optId));
            isCorrect = isFullyCorrect;
            isWrong = studentSelected.length > 0 && !isFullyCorrect;
          }

          return (
            <div key={q._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {q.type === "SUBJECTIVE" ? (
                    <FileText className="w-6 h-6 text-blue-500" />
                  ) : isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : isWrong ? (
                    <XCircle className="w-6 h-6 text-red-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900"><span className="text-gray-500 mr-2">Q{idx + 1}.</span>{q.text}</h3>
                    <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Marks: {q.marks || quiz.marksPerQuestion}
                    </span>
                  </div>

                  {q.type !== "SUBJECTIVE" ? (
                    <div className="space-y-2 mt-4">
                      {q.options.map((opt: any) => {
                        const isStudentChoice = studentSelected.includes(opt._id.toString());
                        const isRightChoice = opt.isCorrect;
                        
                        let borderClass = "border-gray-200 bg-white";
                        if (isRightChoice) borderClass = "border-green-500 bg-green-50";
                        else if (isStudentChoice && !isRightChoice) borderClass = "border-red-500 bg-red-50";

                        return (
                          <div key={opt._id} className={`flex items-center p-3 border rounded-lg ${borderClass}`}>
                            <div className="flex-1 text-sm font-medium text-gray-800">{opt.text}</div>
                            <div className="flex items-center gap-2 text-xs font-bold">
                              {isStudentChoice && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Your Answer</span>}
                              {isRightChoice && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-green-800"><CheckCircle className="w-3 h-3 inline mr-1"/>Correct</span>}
                              {isStudentChoice && !isRightChoice && <span className="bg-red-100 text-red-700 px-2 py-1 rounded"><XCircle className="w-3 h-3 inline mr-1"/>Wrong</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Your Uploaded Files:</p>
                      {(studentAnsObj?.fileUrls || []).length > 0 ? (
                        <div className="flex gap-4">
                          {studentAnsObj.fileUrls.map((url: string, i: number) => (
                            <img key={i} src={url} alt={`Upload ${i}`} className="w-24 h-24 object-cover rounded border" />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No files uploaded.</p>
                      )}
                    </div>
                  )}

                  {/* Explanation Section */}
                  {q.explanation && (
                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                      <h4 className="text-sm font-bold text-indigo-900 mb-2">Explanation / Solution:</h4>
                      <p className="text-sm text-indigo-800 whitespace-pre-wrap">{q.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
