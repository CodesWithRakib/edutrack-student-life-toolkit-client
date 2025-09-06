"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Exam } from "@/types/exam";
import { CheckCircle, XCircle, Clock, Award } from "lucide-react";
import { useExams } from "@/hooks/useExams";

export function TakeExamModal({
  exam,
  onClose,
}: {
  exam: Exam;
  onClose: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(exam.questions.length * 60); // 1 min per question

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !results) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !results) {
      // Auto-submit when time runs out
      handleSubmit();
    }
  }, [timeLeft, results]);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // inside your component
  const { submitExam } = useExams();

  const handleSubmit = async () => {
    try {
      if (!exam?._id) return;

      // Call the mutation
      const res = await submitExam.mutateAsync({
        id: exam._id,
        answers, // Record<string, string>
      });

      setResults(res); // res contains { score, total, results }

      toast.success(
        `Score: ${res.score}/${res.total} (${(
          (res.score / res.total) *
          100
        ).toFixed(1)}%)`
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to submit exam");
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const mcqOptions = ["A", "B", "C", "D"];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {exam.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {exam.subject} • {exam.difficulty}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {!results && (
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  timeLeft < 60
                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
                }`}
              >
                <Clock size={18} />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!results ? (
            <div className="space-y-6">
              {exam.questions.map((q, idx) => (
                <Card
                  key={q._id}
                  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 mr-3">
                        {idx + 1}
                      </span>
                      {q.questionText}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {q.type === "multiple-choice" &&
                      q.options?.map((opt, i) => (
                        <label
                          key={i}
                          className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={q._id}
                            value={mcqOptions[i]}
                            checked={answers[q._id] === mcqOptions[i]}
                            onChange={(e) =>
                              handleChange(q._id, e.target.value)
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                          />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">
                            <span className="font-medium">
                              {mcqOptions[i]}.
                            </span>{" "}
                            {opt}
                          </span>
                        </label>
                      ))}
                    {q.type === "true-false" &&
                      ["True", "False"].map((val) => (
                        <label
                          key={val}
                          className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={q._id}
                            value={val}
                            checked={answers[q._id] === val}
                            onChange={(e) =>
                              handleChange(q._id, e.target.value)
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                          />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">
                            {val}
                          </span>
                        </label>
                      ))}
                    {q.type === "short-answer" && (
                      <Input
                        value={answers[q._id] || ""}
                        placeholder="Type your answer"
                        onChange={(e) => handleChange(q._id, e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                    )}
                    {q.type === "essay" && (
                      <Textarea
                        value={answers[q._id] || ""}
                        placeholder="Write your essay answer here..."
                        onChange={(e) => handleChange(q._id, e.target.value)}
                        className="min-h-[120px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Exam Results
                </h3>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {results.score}/{results.total} (
                  {((results.score / results.total) * 100).toFixed(1)}%)
                </div>
              </div>

              <div className="space-y-4">
                {results.results.map((r: any, idx: number) => {
                  const question = exam.questions.find(
                    (q) => q._id === r.questionId
                  );
                  const isCorrect = r.isCorrect;
                  return (
                    <Card
                      key={r.questionId}
                      className={`border-l-4 ${
                        isCorrect
                          ? "border-green-500 dark:border-green-400"
                          : "border-red-500 dark:border-red-400"
                      } bg-white dark:bg-gray-800 shadow-sm`}
                    >
                      <CardContent className="p-4">
                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                          Q{idx + 1}: {question?.questionText}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Your Answer:
                            </p>
                            <p className="text-gray-900 dark:text-white">
                              {r.userAnswer || (
                                <span className="text-gray-500 dark:text-gray-400 italic">
                                  (No answer)
                                </span>
                              )}
                            </p>
                          </div>
                          {question?.type !== "essay" &&
                            question?.correctAnswer && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Correct Answer:
                                </p>
                                <p className="text-gray-900 dark:text-white">
                                  {question.correctAnswer}
                                </p>
                              </div>
                            )}
                        </div>
                        <div
                          className={`mt-3 flex items-center gap-2 font-medium ${
                            isCorrect
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                          {r.feedback}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 flex-shrink-0">
          {!results ? (
            <>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Submit Exam
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setResults(null);
                  setAnswers({});
                  setTimeLeft(exam.questions.length * 60);
                }}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Retake Exam
              </Button>
              <Button
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
