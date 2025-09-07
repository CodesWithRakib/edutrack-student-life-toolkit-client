"use client";
import { useExams } from "@/hooks/useExams";
import type { Exam } from "@/types/exam";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import {
  BookOpen,
  ListChecks,
  Settings,
  Trash2,
  Edit,
  Play,
  Calendar,
  Clock,
} from "lucide-react";

export function ExamList({
  exams,
  onEdit,
  onTake,
}: {
  exams: Exam[];
  onEdit: (exam: Exam) => void;
  onTake: (exam: Exam) => void;
}) {
  const { deleteExam } = useExams();

  if (!exams || exams.length === 0)
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No exams found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Create your first exam to get started
        </p>
      </div>
    );

  // Function to get difficulty badge color
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700";
      case "medium":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700";
      case "hard":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600";
    }
  };

  // Function to calculate question type distribution
  const getQuestionTypeDistribution = (exam: Exam) => {
    const types = {
      "multiple-choice": 0,
      "true-false": 0,
      "short-answer": 0,
      essay: 0,
    };

    exam.questions.forEach((question) => {
      types[question.type]++;
    });

    return types;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => {
        const questionTypes = getQuestionTypeDistribution(exam);

        return (
          <Card
            key={exam._id}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {exam.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(exam.createdAt).toLocaleDateString()}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                >
                  <BookOpen className="w-3 h-3" /> {exam.subject}
                </Badge>
                <Badge
                  variant="outline"
                  className={getDifficultyBadge(exam.difficulty)}
                >
                  <Settings className="w-3 h-3" />{" "}
                  {exam.difficulty.toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  <ListChecks className="w-3 h-3" /> {exam.questions.length}{" "}
                  Questions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Question Type Distribution */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Question Types
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(questionTypes).map(([type, count]) => {
                    if (count === 0) return null;

                    const typeColors = {
                      "multiple-choice":
                        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
                      "true-false":
                        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
                      "short-answer":
                        "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
                      essay:
                        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
                    };

                    return (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {type.replace("-", " ")}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            typeColors[type as keyof typeof typeColors]
                          }`}
                        >
                          {count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(exam)}
                  className="flex-1 flex items-center justify-center gap-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => onTake(exam)}
                  className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Play className="w-4 h-4" /> Take
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    deleteExam.mutate(exam._id, {
                      onSuccess: () =>
                        toast.success("Exam deleted successfully"),
                      onError: () => toast.error("Failed to delete exam"),
                    })
                  }
                  className="flex items-center justify-center gap-1 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
