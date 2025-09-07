"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useExams } from "@/hooks/useExams";
import type { DifficultyLevel, Exam } from "@/types/exam";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3, BookOpen, Target } from "lucide-react";

// Define counts schema
const countsSchema = z.object({
  mcq: z.number().min(1, "At least 1 MCQ required"),
  trueFalse: z.number().min(1, "At least 1 True/False required"),
  short: z.number().min(1, "At least 1 Short Answer required"),
  essay: z.number().min(1, "At least 1 Essay required"),
});

// Main form schema
const formSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  counts: countsSchema,
});

// Use FormValues instead of importing GenerateExamRequest
type FormValues = z.infer<typeof formSchema>;

// Define the error type based on your backend response
interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

// Type guard for API errors
function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null;
}

export function ExamGeneratorForm() {
  const { generateExam } = useExams();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      difficulty: "easy",
      counts: { mcq: 5, trueFalse: 3, short: 2, essay: 1 },
    },
  });

  const onSubmit = (values: FormValues) => {
    generateExam.mutate(values, {
      onSuccess: (exam: Exam) => {
        toast.success(`✅ Exam "${exam.title}" generated successfully!`);
        form.reset();
      },
      onError: (err: unknown) => {
        let errorMessage = "Failed to generate exam";
        if (isApiError(err)) {
          errorMessage =
            err.response?.data?.error || err.message || errorMessage;
        }
        toast.error(errorMessage);
      },
    });
  };

  // Define the count fields with proper typing
  const countFields = [
    {
      key: "mcq" as const,
      label: "MCQ",
      icon: Target,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    },
    {
      key: "trueFalse" as const,
      label: "True/False",
      icon: BarChart3,
      color:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    },
    {
      key: "short" as const,
      label: "Short Answer",
      icon: FileText,
      color:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
    },
    {
      key: "essay" as const,
      label: "Essay",
      icon: BookOpen,
      color:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
    },
  ];

  return (
    <Card className="border-0 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
        <CardTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate New Exam
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          placeholder="e.g. Biology"
                          {...field}
                          className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {form.formState.errors.subject?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Difficulty */}
              <Controller
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Difficulty <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: DifficultyLevel) =>
                          field.onChange(value)
                        }
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                          <SelectItem
                            value="easy"
                            className="flex items-center gap-2"
                          >
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            Easy
                          </SelectItem>
                          <SelectItem
                            value="medium"
                            className="flex items-center gap-2"
                          >
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            Medium
                          </SelectItem>
                          <SelectItem
                            value="hard"
                            className="flex items-center gap-2"
                          >
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            Hard
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {form.formState.errors.difficulty?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* Question counts */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Question Counts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {countFields.map(({ key, label, icon: Icon, color }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`counts.${key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label} <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Badge className={color} variant="outline">
                                {label.charAt(0)}
                              </Badge>
                            </div>
                            <Input
                              type="number"
                              min={1}
                              value={field.value}
                              className="pl-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                field.onChange(isNaN(value) ? 0 : value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {form.formState.errors.counts?.[key]?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              disabled={generateExam.isPending}
            >
              {generateExam.isPending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  Generate Exam
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
