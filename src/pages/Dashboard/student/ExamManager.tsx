"use client";
import { useState, useMemo } from "react";
import { ExamGeneratorForm } from "@/components/exams/ExamGeneratorForm";
import { ExamList } from "@/components/exams/ExamList";
import { EditExamModal } from "@/components/exams/EditExamModal";
import { TakeExamModal } from "@/components/exams/TakeExamModal";
import { useExams } from "@/hooks/useExams";
import type { Exam } from "@/types/exam";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, BookOpen, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ExamManager() {
  const { exams, isLoading, isError } = useExams();
  const [selectedExamForEdit, setSelectedExamForEdit] = useState<Exam | null>(
    null
  );
  const [selectedExamForTake, setSelectedExamForTake] = useState<Exam | null>(
    null
  );
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  // Get unique subjects from exams
  const subjects = useMemo(() => {
    if (!exams) return [];
    return Array.from(new Set(exams.map((e) => e.subject)));
  }, [exams]);

  // Filter exams
  const filteredExams = useMemo(() => {
    return exams?.filter((e) => {
      const subjectMatch =
        filterSubject === "all" || e.subject === filterSubject;
      const difficultyMatch =
        filterDifficulty === "all" || e.difficulty === filterDifficulty;
      return subjectMatch && difficultyMatch;
    });
  }, [exams, filterSubject, filterDifficulty]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading exams...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="max-w-md shadow-lg border-0">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-destructive mb-2">
              Error Loading Exams
            </h2>
            <p className="text-muted-foreground">Please try again later</p>
            <Button
              variant="outline"
              className="mt-4 border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Exam Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Create, manage, and take exams
            </p>
          </div>
          <Button
            onClick={() =>
              document
                .getElementById("generate-exam")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            variant="outline"
            className="shadow-sm hover:shadow-md transition-all duration-300"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Generate New Exam
          </Button>
        </header>

        {/* Generate New Exam */}
        <section id="generate-exam" className="mb-16">
          <Card className="shadow-md border-0 bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-primary">
                <BookOpen className="h-5 w-5" />
                Generate New Exam
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ExamGeneratorForm />
            </CardContent>
          </Card>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <Card className="shadow-sm border-0 bg-card p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex items-center gap-2 min-w-max">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Filter Exams</h2>
              </div>
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-48 md:w-56 shadow-sm">
                    <SelectValue placeholder="Filter by Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterDifficulty}
                  onValueChange={setFilterDifficulty}
                >
                  <SelectTrigger className="w-48 md:w-56 shadow-sm">
                    <SelectValue placeholder="Filter by Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterSubject("all");
                    setFilterDifficulty("all");
                  }}
                  className="h-10"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Exam List */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Existing Exams</h2>
              <Badge variant="secondary" className="text-xs">
                {filteredExams?.length || 0} exams
              </Badge>
            </div>
            {(filterSubject !== "all" || filterDifficulty !== "all") && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Active filters:</span>
                <div className="flex gap-1">
                  {filterSubject !== "all" && (
                    <Badge variant="outline" className="text-xs">
                      {filterSubject}
                    </Badge>
                  )}
                  {filterDifficulty !== "all" && (
                    <Badge variant="outline" className="text-xs capitalize">
                      {filterDifficulty}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {filteredExams && filteredExams.length > 0 ? (
            <ExamList
              exams={filteredExams}
              onEdit={setSelectedExamForEdit}
              onTake={setSelectedExamForTake}
            />
          ) : (
            <Card className="shadow-sm border-0 bg-card p-8 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No exams found</h3>
              <p className="text-muted-foreground mb-4">
                {exams && exams.length > 0
                  ? "Try adjusting your filters to see more results."
                  : "Generate your first exam to get started."}
              </p>
              {exams && exams.length > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterSubject("all");
                    setFilterDifficulty("all");
                  }}
                  className="mr-2"
                >
                  Clear Filters
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    document
                      .getElementById("generate-exam")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Generate Your First Exam
                </Button>
              )}
            </Card>
          )}
        </section>
      </div>

      {/* Modals */}
      {selectedExamForEdit && (
        <EditExamModal
          exam={selectedExamForEdit}
          onClose={() => setSelectedExamForEdit(null)}
        />
      )}
      {selectedExamForTake && (
        <TakeExamModal
          exam={selectedExamForTake}
          onClose={() => setSelectedExamForTake(null)}
        />
      )}
    </div>
  );
}
