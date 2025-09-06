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
            className="mx-auto h-12 w-12"
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
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          No exams found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first exam to get started
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <Card
          key={exam._id}
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
              {exam.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
              >
                <BookOpen className="w-3 h-3" /> {exam.subject}
              </Badge>
              <Badge
                variant={
                  exam.difficulty === "easy"
                    ? "default"
                    : exam.difficulty === "medium"
                    ? "secondary"
                    : "destructive"
                }
                className={`flex items-center gap-1 ${
                  exam.difficulty === "easy"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : exam.difficulty === "medium"
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                }`}
              >
                <Settings className="w-3 h-3" /> {exam.difficulty.toUpperCase()}
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
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(exam)}
                className="flex-1 flex items-center justify-center gap-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit className="w-4 h-4" /> Edit
              </Button>
              <Button
                size="sm"
                onClick={() => onTake(exam)}
                className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Play className="w-4 h-4" /> Take
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  deleteExam.mutate(exam._id, {
                    onSuccess: () => toast.success("Exam deleted successfully"),
                    onError: () => toast.error("Failed to delete exam"),
                  })
                }
                className="flex items-center justify-center gap-1 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
