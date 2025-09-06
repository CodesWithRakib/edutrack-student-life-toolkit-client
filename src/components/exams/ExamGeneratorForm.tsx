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

// Define counts schema
const countsSchema = z.object({
  mcq: z.coerce.number().min(1, "At least 1 MCQ required"),
  trueFalse: z.coerce.number().min(1, "At least 1 True/False required"),
  short: z.coerce.number().min(1, "At least 1 Short Answer required"),
  essay: z.coerce.number().min(1, "At least 1 Essay required"),
});

// Main form schema
const formSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  counts: countsSchema,
});

type FormValues = z.infer<typeof formSchema>;

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
      onSuccess: (exam) => {
        toast.success(`✅ Exam "${exam.subject}" generated successfully!`);
        form.reset();
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.error || "Failed to generate exam"),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Subject
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Biology"
                    {...field}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Difficulty */}
          <Controller
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Difficulty
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Question counts */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Question Counts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(form.getValues("counts")).map(([key, value]) => (
              <FormField
                key={key}
                control={form.control}
                name={`counts.${key}` as keyof FormValues["counts"]}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors duration-300"
          disabled={generateExam.isPending}
        >
          {generateExam.isPending ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            </span>
          ) : (
            "Generate Exam"
          )}
        </Button>
      </form>
    </Form>
  );
}
