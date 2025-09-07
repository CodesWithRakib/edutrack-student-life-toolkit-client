"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Exam, ExamResult, QuestionResult } from "@/types/exam";
import { CheckCircle, XCircle, Clock, Award, X } from "lucide-react";
import { useExams } from "@/hooks/useExams";

interface TakeExamModalProps {
  exam: Exam;
  onClose: () => void;
}

export function TakeExamModal({ exam, onClose }: TakeExamModalProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ExamResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(exam.questions.length * 60); // 1 min per question
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

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

  const { submitExam } = useExams();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!exam?._id) {
        toast.error("Exam ID is missing");
        return;
      }

      // Call the mutation
      const res = await submitExam.mutateAsync({
        id: exam._id,
        answers,
      });

      setResults(res);

      toast.success(
        `Score: ${res.score}/${res.total} (${(
          (res.score / res.total) *
          100
        ).toFixed(1)}%)`,
        {
          description:
            res.score === res.total
              ? "Perfect score! 🎉"
              : res.score / res.total > 0.7
              ? "Great job! 👍"
              : "Keep practicing! 💪",
        }
      );
    } catch (err: unknown) {
      let errorMessage = "Failed to submit exam";

      // Check if it's an Axios error with response data
      if (typeof err === "object" && err !== null) {
        // Type guard for Axios error
        if ("response" in err) {
          const axiosError = err as {
            response?: { data?: { error?: string } };
          };
          errorMessage = axiosError.response?.data?.error || errorMessage;
        }
        // Handle other error types if needed
        else if ("message" in err) {
          const errorObj = err as { message?: string };
          errorMessage = errorObj.message || errorMessage;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const mcqOptions = ["A", "B", "C", "D"];

  const progressPercentage =
    ((currentQuestionIndex + 1) / exam.questions.length) * 100;

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
                    : timeLeft < 300
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
                    : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                }`}
              >
                <Clock size={18} />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Progress bar for questions */}
        {!results && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
            <div
              className="bg-indigo-600 h-2 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!results ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Question {currentQuestionIndex + 1} of {exam.questions.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(exam.questions.length - 1, prev + 1)
                      )
                    }
                    disabled={
                      currentQuestionIndex === exam.questions.length - 1
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>

              <Card
                key={exam.questions[currentQuestionIndex]._id}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 mr-3">
                      {currentQuestionIndex + 1}
                    </span>
                    {exam.questions[currentQuestionIndex].questionText}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {exam.questions[currentQuestionIndex].type ===
                    "multiple-choice" &&
                    exam.questions[currentQuestionIndex].options?.map(
                      (opt, i) => (
                        <label
                          key={i}
                          className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={exam.questions[currentQuestionIndex]._id}
                            value={mcqOptions[i]}
                            checked={
                              answers[
                                exam.questions[currentQuestionIndex]._id
                              ] === mcqOptions[i]
                            }
                            onChange={(e) =>
                              handleChange(
                                exam.questions[currentQuestionIndex]._id,
                                e.target.value
                              )
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
                      )
                    )}
                  {exam.questions[currentQuestionIndex].type === "true-false" &&
                    ["True", "False"].map((val) => (
                      <label
                        key={val}
                        className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name={exam.questions[currentQuestionIndex]._id}
                          value={val}
                          checked={
                            answers[
                              exam.questions[currentQuestionIndex]._id
                            ] === val
                          }
                          onChange={(e) =>
                            handleChange(
                              exam.questions[currentQuestionIndex]._id,
                              e.target.value
                            )
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                        />
                        <span className="ml-3 text-gray-700 dark:text-gray-300">
                          {val}
                        </span>
                      </label>
                    ))}
                  {exam.questions[currentQuestionIndex].type ===
                    "short-answer" && (
                    <Input
                      value={
                        answers[exam.questions[currentQuestionIndex]._id] || ""
                      }
                      placeholder="Type your answer"
                      onChange={(e) =>
                        handleChange(
                          exam.questions[currentQuestionIndex]._id,
                          e.target.value
                        )
                      }
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  )}
                  {exam.questions[currentQuestionIndex].type === "essay" && (
                    <Textarea
                      value={
                        answers[exam.questions[currentQuestionIndex]._id] || ""
                      }
                      placeholder="Write your essay answer here..."
                      onChange={(e) =>
                        handleChange(
                          exam.questions[currentQuestionIndex]._id,
                          e.target.value
                        )
                      }
                      className="min-h-[120px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Question navigation dots */}
              <div className="flex justify-center gap-2 mt-6">
                {exam.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQuestionIndex
                        ? "bg-indigo-600"
                        : answers[exam.questions[index]._id]
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    aria-label={`Go to question ${index + 1}`}
                  />
                ))}
              </div>
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
                <div className="mt-2 text-gray-600 dark:text-gray-400">
                  {results.score === results.total
                    ? "Perfect score! 🎉"
                    : results.score / results.total > 0.7
                    ? "Great job! 👍"
                    : "Keep practicing! 💪"}
                </div>
              </div>

              <div className="space-y-4">
                {results.results.map((r: QuestionResult, idx: number) => {
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
                disabled={isSubmitting || Object.keys(answers).length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Exam"}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setResults(null);
                  setAnswers({});
                  setTimeLeft(exam.questions.length * 60);
                  setCurrentQuestionIndex(0);
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
