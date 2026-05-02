"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, ExternalLink, Image as ImageIcon } from "lucide-react";

export default function EvaluationsPage() {
  const { id: quizId } = useParams();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Evaluation modal/view state
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null);
  const [marksUpdates, setMarksUpdates] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchData();
  }, [quizId]);

  const fetchData = async () => {
    try {
      // Fetch quiz details & questions
      const quizRes = await fetch(`/api/quizzes/${quizId}`);
      if (quizRes.ok) {
        const quizData = await quizRes.json();
        setQuiz(quizData.quiz);
        setQuestions(quizData.questions);
      }

      // Fetch attempts
      const attemptsRes = await fetch(`/api/evaluations?quizId=${quizId}`);
      if (attemptsRes.ok) {
        const attemptsData = await attemptsRes.json();
        setAttempts(attemptsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAttempt = (attempt: any) => {
    setSelectedAttempt(attempt);
    setFeedback(attempt.evaluationFeedback || "");
    const initialMarks: Record<string, number> = {};
    attempt.answers.forEach((ans: any) => {
      initialMarks[ans.questionId] = ans.marksAwarded || 0;
    });
    setMarksUpdates(initialMarks);
  };

  const handleSubmitEvaluation = async () => {
    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: selectedAttempt._id,
          marksUpdates,
          feedback,
        }),
      });

      if (res.ok) {
        alert("Evaluation saved successfully!");
        setSelectedAttempt(null);
        fetchData(); // Refresh list
      } else {
        alert("Failed to save evaluation");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading evaluations...</div>;

  const subjectiveQuestions = questions.filter((q) => q.type === "SUBJECTIVE");

  if (selectedAttempt) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <button
          onClick={() => setSelectedAttempt(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back to List
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Evaluating: {selectedAttempt.userId?.name}</h2>
              <p className="text-sm text-gray-500">{selectedAttempt.userId?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Objective Score</p>
              <p className="text-2xl font-bold text-indigo-600">{selectedAttempt.score}</p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {subjectiveQuestions.length === 0 ? (
              <p>No subjective questions found.</p>
            ) : (
              subjectiveQuestions.map((q, index) => {
                const answer = selectedAttempt.answers.find((a: any) => a.questionId === q._id);
                return (
                  <div key={q._id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Q{index + 1}. {q.text}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Max Marks: {q.marks || quiz?.marksPerQuestion}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg">
                        <span className="text-sm font-medium text-indigo-900">Marks Awarded:</span>
                        <input
                          type="number"
                          min="0"
                          max={q.marks || quiz?.marksPerQuestion}
                          step="0.5"
                          className="w-20 px-2 py-1 border rounded focus:ring-indigo-500"
                          value={marksUpdates[q._id] || ""}
                          onChange={(e) =>
                            setMarksUpdates({ ...marksUpdates, [q._id]: parseFloat(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Uploaded Answer Files:
                      </h4>
                      {answer?.fileUrls && answer.fileUrls.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {answer.fileUrls.map((url: string, i: number) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block relative group aspect-square rounded-lg border border-gray-200 overflow-hidden"
                            >
                              <img
                                src={url}
                                alt={`Answer ${i + 1}`}
                                className="w-full h-full object-cover group-hover:opacity-75 transition"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition">
                                <ExternalLink className="w-6 h-6 text-white" />
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-red-500 italic">No files uploaded for this question.</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Overall Feedback (Optional)</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="Provide feedback for the student..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEvaluation}
                className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium"
              >
                Save Evaluation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/quizzes/${quizId}/edit`} className="text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subjective Evaluations</h1>
          <p className="text-sm text-gray-500">Review and mark uploaded answer sheets.</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Objective Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attempts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  No submissions pending evaluation.
                </td>
              </tr>
            ) : (
              attempts.map((attempt) => (
                <tr key={attempt._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{attempt.userId?.name}</div>
                    <div className="text-sm text-gray-500">{attempt.userId?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(attempt.endTime || attempt.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {attempt.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attempt.status === "EVALUATED" ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Evaluated
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                        <Clock className="w-4 h-4" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleSelectAttempt(attempt)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                    >
                      {attempt.status === "EVALUATED" ? "Re-evaluate" : "Evaluate"}
                    </button>
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
