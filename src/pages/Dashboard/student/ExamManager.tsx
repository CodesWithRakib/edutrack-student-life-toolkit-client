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
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading exams...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="max-w-md shadow-lg border-0">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500 dark:text-red-400"
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
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              Error Loading Exams
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please try again later
            </p>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
              Exam Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Create, manage, and take exams
            </p>
          </div>
        </header>

        {/* Generate New Exam */}
        <section className="mb-16">
          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <BookOpen className="h-5 w-5" />
                Generate New Exam
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ExamGeneratorForm />
            </CardContent>
          </Card>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <Card className="shadow-sm border-0 bg-white dark:bg-gray-800 p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-indigo-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Filter Exams
                </h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm">
                    <SelectValue placeholder="Filter by Subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-md">
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
                  <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm">
                    <SelectValue placeholder="Filter by Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-md">
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </section>

        {/* Exam List */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Existing Exams
            </h2>
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {filteredExams?.length || 0} exams
            </span>
          </div>
          <ExamList
            exams={filteredExams || []}
            onEdit={setSelectedExamForEdit}
            onTake={setSelectedExamForTake}
          />
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
