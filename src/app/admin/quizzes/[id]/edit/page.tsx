"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, FileText, Image as ImageIcon, Sparkles } from "lucide-react";

export default function EditQuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New question form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "MCQ",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ],
    marks: "",
    negativeMarks: "",
    explanation: "",
  });
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    fetchQuizData();
  }, [id]);

  const fetchQuizData = async () => {
    try {
      const res = await fetch(`/api/quizzes/${id}`);
      if (res.ok) {
        const data = await res.json();
        setQuiz(data.quiz);
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      });
      if (res.ok) {
        alert("Quiz updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        quizId: id,
        text: newQuestion.text,
        type: newQuestion.type,
        options: newQuestion.type === "SUBJECTIVE" ? [] : newQuestion.options,
        marks: newQuestion.marks ? parseFloat(newQuestion.marks) : quiz.marksPerQuestion,
        negativeMarks: newQuestion.negativeMarks ? parseFloat(newQuestion.negativeMarks) : quiz.negativeMarksValue,
        explanation: newQuestion.explanation,
      };

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions([...questions, data.question]);
        setShowAddForm(false);
        setNewQuestion({
          text: "",
          type: "MCQ",
          options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }],
          marks: "",
          negativeMarks: "",
          explanation: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateAI = async () => {
    if (!newQuestion.text) {
      alert("Please enter the question text first.");
      return;
    }
    
    setGeneratingAI(true);
    try {
      const res = await fetch("/api/generate-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newQuestion.text,
          options: newQuestion.options,
          type: newQuestion.type
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewQuestion(prev => ({ ...prev, explanation: data.explanation }));
      } else {
        alert(data.message || "Failed to generate explanation. Ensure API key is set.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating explanation.");
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      const res = await fetch(`/api/questions/${qId}`, { method: "DELETE" });
      if (res.ok) {
        setQuestions(questions.filter((q) => q._id !== qId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateOption = (index: number, field: string, value: any) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    
    // For MCQ, only one correct option
    if (newQuestion.type === "MCQ" && field === "isCorrect" && value === true) {
      updatedOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  if (loading) return <div>Loading...</div>;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/quizzes" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
        </div>
        <Link
          href={`/admin/quizzes/${id}/evaluations`}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
        >
          <FileText className="w-4 h-4" />
          View Evaluations
        </Link>
      </div>

      {/* Quiz Details Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">Quiz Settings</h2>
        </div>
        <form onSubmit={handleUpdateQuiz} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                value={quiz.duration}
                onChange={(e) => setQuiz({ ...quiz, duration: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Attempts</label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                value={quiz.maxAttempts || 1}
                onChange={(e) => setQuiz({ ...quiz, maxAttempts: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
             <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-indigo-600"
                checked={quiz.isPublished}
                onChange={(e) => setQuiz({ ...quiz, isPublished: e.target.checked })}
              />
              <span className="ml-2 text-sm">Published</span>
            </label>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </form>
      </div>

      {/* Questions Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">Questions ({questions.length})</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>

        {/* Add Question Form */}
        {showAddForm && (
          <div className="p-6 bg-indigo-50 border-b border-indigo-100">
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                <select
                  className="w-full md:w-1/3 px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                >
                  <option value="MCQ">Multiple Choice (Single Correct)</option>
                  <option value="MULTIPLE_CORRECT">Multiple Correct Options</option>
                  <option value="TRUE_FALSE">True / False</option>
                  <option value="SUBJECTIVE">Subjective (File Upload)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="Enter your question here..."
                />
              </div>

              {/* Options Builder for Objective questions */}
              {newQuestion.type !== "SUBJECTIVE" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  {newQuestion.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input
                        type={newQuestion.type === "MULTIPLE_CORRECT" ? "checkbox" : "radio"}
                        name="correct_option"
                        checked={opt.isCorrect}
                        onChange={(e) => updateOption(i, "isCorrect", e.target.checked)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <input
                        type="text"
                        required
                        className="flex-1 px-3 py-1 border rounded focus:ring-indigo-500"
                        placeholder={`Option ${i + 1}`}
                        value={opt.text}
                        onChange={(e) => updateOption(i, "text", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newOpts = [...newQuestion.options];
                          newOpts.splice(i, 1);
                          setNewQuestion({ ...newQuestion, options: newOpts });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setNewQuestion({
                        ...newQuestion,
                        options: [...newQuestion.options, { text: "", isCorrect: false }],
                      })
                    }
                    className="text-sm text-indigo-600 font-medium hover:underline"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {newQuestion.type === "SUBJECTIVE" && (
                <div className="bg-yellow-50 p-4 rounded-md text-sm text-yellow-800 border border-yellow-200 flex gap-2">
                  <ImageIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <p>Students will be asked to write their answers on paper and upload a photo or PDF file. This question will require manual evaluation.</p>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Explanation (Optional)</label>
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={generatingAI}
                    className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    {generatingAI ? "Generating..." : "Generate with AI"}
                  </button>
                </div>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={newQuestion.explanation || ""}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  placeholder="Explain why the answer is correct..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Save Question
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Questions List */}
        <div className="divide-y divide-gray-100">
          {questions.map((q, index) => (
            <div key={q._id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <span className="font-bold text-gray-500">{index + 1}.</span>
                  <div>
                    <h3 className="font-medium text-gray-900 whitespace-pre-wrap">{q.text}</h3>
                    <div className="mt-1 flex gap-2">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {q.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        Marks: {q.marks || quiz.marksPerQuestion}
                      </span>
                    </div>

                    {q.type !== "SUBJECTIVE" && (
                      <ul className="mt-3 space-y-1">
                        {q.options?.map((opt: any, i: number) => (
                          <li
                            key={i}
                            className={`text-sm flex items-center gap-2 ${
                              opt.isCorrect ? "text-green-700 font-medium" : "text-gray-600"
                            }`}
                          >
                            <span className="w-4">{opt.isCorrect ? "✓" : ""}</span>
                            {opt.text}
                          </li>
                        ))}
                      </ul>
                    )}
                    {q.type === "SUBJECTIVE" && (
                      <div className="mt-3 text-sm text-gray-500 border-l-2 border-indigo-300 pl-3">
                        [ Subjective File Upload Answer Expected ]
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="text-red-400 hover:text-red-600 p-2"
                  title="Delete Question"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {questions.length === 0 && !showAddForm && (
            <div className="p-8 text-center text-gray-500">
              No questions added yet. Click "Add Question" to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
