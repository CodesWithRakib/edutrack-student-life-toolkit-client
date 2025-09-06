"use client";
import { useState, useMemo, useEffect } from "react";
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
import { Loader2, Moon, Sun } from "lucide-react";

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
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize dark mode from system preference
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-12">
        <div className="text-2xl font-bold text-red-500 dark:text-red-400 mb-2">
          Error Loading Exams
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Please try again later
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Exam Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Create, manage, and take exams
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </header>

        {/* Generate New Exam */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Generate New Exam
            </h2>
            <ExamGeneratorForm />
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Filter Exams
            </h2>
            <div className="flex flex-wrap gap-4">
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Filter by Subject" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
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
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Filter by Difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Exam List */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Existing Exams
          </h2>
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
