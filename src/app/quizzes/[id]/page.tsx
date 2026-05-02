"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, AlertTriangle, UploadCloud, X, CheckCircle, Image as ImageIcon } from "lucide-react";

export default function QuizInterfacePage() {
  const { id } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selectedOptions?: string[], fileUrls?: string[] }>>({});
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [warnings, setWarnings] = useState(0);

  // Uploading state
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (hasStarted && timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (hasStarted && timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [hasStarted, timeLeft, isSubmitted]);

  // Tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted && !isSubmitted) {
        setWarnings((prev) => {
          const newWarnings = prev + 1;
          alert(`Warning ${newWarnings}/3: Tab switching is not allowed during the quiz!`);
          if (newWarnings >= 3) {
            handleSubmit(); // Auto submit after 3 warnings
          }
          return newWarnings;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasStarted, isSubmitted]);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`/api/quizzes/${id}`);
      if (res.ok) {
        const data = await res.json();
        setQuiz(data.quiz);
        setQuestions(data.questions);
        setTimeLeft(data.quiz.duration * 60);
      } else {
        router.push("/quizzes");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      const res = await fetch("/api/attempts/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setAttemptId(data.attempt._id);
        setHasStarted(true);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to start quiz.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionSelect = (qId: string, optId: string, type: string) => {
    setAnswers((prev) => {
      const currentAns = prev[qId] || { selectedOptions: [] };
      let newSelected = currentAns.selectedOptions || [];

      if (type === "MCQ" || type === "TRUE_FALSE") {
        newSelected = [optId];
      } else if (type === "MULTIPLE_CORRECT") {
        if (newSelected.includes(optId)) {
          newSelected = newSelected.filter((id) => id !== optId);
        } else {
          newSelected = [...newSelected, optId];
        }
      }

      return { ...prev, [qId]: { ...currentAns, selectedOptions: newSelected } };
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setVisited((prev) => new Set(prev).add(nextIdx));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      setVisited((prev) => new Set(prev).add(prevIdx));
    }
  };

  const handleClearResponse = (qId: string) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[qId];
      return newAnswers;
    });
  };

  const handleMarkForReview = () => {
    setFlagged((prev) => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(currentQuestionIndex)) {
        newFlagged.delete(currentQuestionIndex);
      } else {
        newFlagged.add(currentQuestionIndex);
      }
      return newFlagged;
    });
  };

  const handleFileUpload = async (qId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setAnswers((prev) => {
          const currentAns = prev[qId] || { fileUrls: [] };
          const newFiles = [...(currentAns.fileUrls || []), data.url];
          return { ...prev, [qId]: { ...currentAns, fileUrls: newFiles } };
        });
      } else {
        alert("Upload failed. Make sure Cloudinary keys are configured.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (qId: string, index: number) => {
    setAnswers((prev) => {
      const currentAns = prev[qId];
      if (!currentAns || !currentAns.fileUrls) return prev;
      const newFiles = [...currentAns.fileUrls];
      newFiles.splice(index, 1);
      return { ...prev, [qId]: { ...currentAns, fileUrls: newFiles } };
    });
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    try {
      const res = await fetch("/api/attempts/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, answers }),
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading quiz...</div>;
  if (!quiz) return <div>Quiz not found</div>;

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-900">Quiz Submitted Successfully!</h1>
        <p className="text-gray-600">Your answers have been recorded.</p>
        <div className="pt-6 flex justify-center gap-4">
          <button
            onClick={() => router.push(`/quizzes/${id}/leaderboard`)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
          >
            View Leaderboard
          </button>
          <button
            onClick={() => router.push(`/quizzes/${id}/analysis`)}
            className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg"
          >
            View Analysis
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600">{quiz.description}</p>
          
          <div className="grid grid-cols-2 gap-4 py-6">
            <div className="bg-indigo-50 p-4 rounded-xl">
              <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-indigo-900">{quiz.duration} mins</div>
              <div className="text-sm text-indigo-600 font-medium">Duration</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-orange-900">{quiz.marksPerQuestion}</div>
              <div className="text-sm text-orange-600 font-medium">Marks per Q</div>
            </div>
          </div>

          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm font-medium text-left">
            <ul className="list-disc pl-5 space-y-1">
              <li>Do not switch tabs during the quiz. You will be warned.</li>
              <li>After 3 warnings, your quiz will be auto-submitted.</li>
              <li>Timer will start immediately after clicking "Start Quiz".</li>
              {quiz.negativeMarking && <li>Negative marking is enabled (-{quiz.negativeMarksValue} per wrong answer).</li>}
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 pb-24">
      {/* Sidebar for Navigation & Timer */}
      <div className="w-full md:w-72 flex-shrink-0 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center sticky top-24">
          <div className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" /> Time Left
          </div>
          <div className={`text-4xl font-mono font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
            {formatTime(timeLeft)}
          </div>
          
          <div className="mt-8">
            <div className="text-sm font-medium text-gray-500 mb-3 text-left">Questions Palette</div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = q.type === "SUBJECTIVE" 
                  ? (answers[q._id]?.fileUrls?.length || 0) > 0 
                  : (answers[q._id]?.selectedOptions?.length || 0) > 0;
                
                const isFlagged = flagged.has(idx);
                const isVisited = visited.has(idx);

                let bgClass = "bg-gray-100 text-gray-600 border-gray-200"; // unvisited
                if (isFlagged) {
                  bgClass = "bg-purple-100 text-purple-700 border-purple-300"; // flagged
                } else if (isAnswered) {
                  bgClass = "bg-green-100 text-green-700 border-green-300"; // answered
                } else if (isVisited) {
                  bgClass = "bg-red-100 text-red-700 border-red-300"; // visited but not answered
                }

                return (
                  <button
                    key={q._id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setVisited(prev => new Set(prev).add(idx));
                    }}
                    className={`w-10 h-10 rounded-md text-sm font-medium flex items-center justify-center transition-colors border ${bgClass} ${
                      currentQuestionIndex === idx ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:opacity-80"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-6 text-xs text-left space-y-2">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded" /> Answered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-100 border border-red-300 rounded" /> Not Answered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded" /> Marked for Review</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded" /> Not Visited</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 flex flex-col space-y-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex-1">
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900 leading-relaxed flex-1 pr-4">
              <span className="text-indigo-600 mr-2">Q{currentQuestionIndex + 1}.</span>
              {currentQ.text}
            </h2>
            <div className="text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-700 flex-shrink-0 uppercase tracking-wider">
              {currentQ.type.replace("_", " ")}
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {currentQ.type !== "SUBJECTIVE" ? (
              currentQ.options.map((opt: any) => {
                const isSelected = (answers[currentQ._id]?.selectedOptions || []).includes(opt._id);
                return (
                  <label
                    key={opt._id}
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      isSelected ? "border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-600" : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type={currentQ.type === "MULTIPLE_CORRECT" ? "checkbox" : "radio"}
                      checked={isSelected}
                      onChange={() => handleOptionSelect(currentQ._id, opt._id, currentQ.type)}
                      className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-4 text-gray-800 text-lg">{opt.text}</span>
                  </label>
                );
              })
            ) : (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex gap-3 text-sm">
                  <ImageIcon className="w-5 h-5 flex-shrink-0" />
                  <p>Write your answer on a paper, take a photo, and upload it here. You can upload multiple images.</p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition relative">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(currentQ._id, e)}
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <UploadCloud className={`w-10 h-10 ${uploading ? 'text-indigo-600 animate-bounce' : 'text-gray-400'}`} />
                    <span className="font-medium text-indigo-600">
                      {uploading ? "Uploading..." : "Click or drag to upload answer"}
                    </span>
                    <span className="text-xs text-gray-500">JPG, PNG, PDF up to 5MB</span>
                  </div>
                </div>

                {/* Uploaded Files Preview */}
                {(answers[currentQ._id]?.fileUrls || []).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {answers[currentQ._id].fileUrls!.map((url, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                        <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFile(currentQ._id, i)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleMarkForReview}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition border ${
                flagged.has(currentQuestionIndex) 
                ? "bg-purple-100 text-purple-700 border-purple-300" 
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {flagged.has(currentQuestionIndex) ? "Unmark Review" : "Mark for Review"}
            </button>
            <button
              onClick={() => handleClearResponse(currentQ._id)}
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-50 transition"
            >
              Clear Response
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 font-medium rounded-lg text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-50 transition"
            >
              Previous
            </button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to submit the quiz?")) handleSubmit();
                }}
                className="px-8 py-2 font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-md transition"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-2 font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
              >
                Save & Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
