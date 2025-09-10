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
import { FileText, BarChart3, BookOpen, Target, Loader2 } from "lucide-react";

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
    <Card className="border-0 shadow-md bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 pb-4">
        <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate New Exam
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Subject <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          placeholder="e.g. Biology"
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive flex items-center gap-1" />
                  </FormItem>
                )}
              />

              {/* Difficulty */}
              <Controller
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Difficulty <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: DifficultyLevel) =>
                          field.onChange(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
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
                    <FormMessage className="text-destructive flex items-center gap-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Question counts */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
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
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label} <span className="text-destructive">*</span>
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
                              className="pl-12"
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                field.onChange(isNaN(value) ? 0 : value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-destructive flex items-center gap-1" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              disabled={generateExam.isPending}
            >
              {generateExam.isPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
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
