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
        <div className="text-muted-foreground mb-4">
          <BookOpen className="mx-auto h-16 w-16 opacity-50" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No exams found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Create your first exam to get started
        </p>
      </div>
    );

  // Function to get difficulty badge variant
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "default";
      case "medium":
        return "secondary";
      case "hard":
        return "destructive";
      default:
        return "outline";
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
            className="border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {exam.title}
                </CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(exam.createdAt).toLocaleDateString()}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {exam.subject}
                </Badge>
                <Badge
                  variant={getDifficultyBadge(exam.difficulty)}
                  className="capitalize"
                >
                  {exam.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <ListChecks className="w-3 h-3" /> {exam.questions.length}{" "}
                  Questions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Question Type Distribution */}
              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                <div className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Question Types
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(questionTypes).map(([type, count]) => {
                    if (count === 0) return null;

                    const typeColors = {
                      "multiple-choice":
                        "bg-blue-500/10 text-blue-700 dark:text-blue-300",
                      "true-false":
                        "bg-green-500/10 text-green-700 dark:text-green-300",
                      "short-answer":
                        "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                      essay:
                        "bg-purple-500/10 text-purple-700 dark:text-purple-300",
                    };

                    return (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-muted-foreground capitalize">
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
                  className="flex-1 flex items-center justify-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => onTake(exam)}
                  className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Take</span>
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
                  className="flex items-center justify-center gap-1 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
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
