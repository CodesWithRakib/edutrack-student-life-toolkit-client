"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExams } from "@/hooks/useExams";
import type { Exam, Question, QuestionType } from "@/types/exam";
import { z } from "zod";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  X,
  GripVertical,
  Copy,
  RotateCcw,
  Save,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

interface EditExamModalProps {
  exam: Exam;
  onClose: () => void;
}

// Zod schema - Fixed to handle different question types properly
const questionSchema = z
  .object({
    type: z.enum(["multiple-choice", "true-false", "short-answer", "essay"]),
    questionText: z.string().min(1, "Question text is required"),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().min(1, "Correct answer is required"),
  })
  .superRefine((data, ctx) => {
    // Only validate options if the question type is multiple-choice
    if (data.type === "multiple-choice") {
      if (!data.options || data.options.length !== 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Multiple choice questions must have exactly 4 options",
          path: ["options"],
        });
      } else if (data.options.some((opt) => !opt.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "All options must be filled",
          path: ["options"],
        });
      }
    }
  });

const examSchema = z.object({
  title: z.string().min(1, "Exam title is required"),
  subject: z.string().min(1, "Subject is required"),
  questions: z.array(questionSchema).min(1, "At least one question required"),
});

type ExamFormValues = z.infer<typeof examSchema>;

// Sortable Question Card
function SortableQuestionCard({
  question,
  index,
  control,
  remove,
  onDuplicate,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
          Question {index + 1}
        </CardTitle>
        <div className="flex gap-2">
          <button
            {...attributes}
            {...listeners}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab text-gray-500 dark:text-gray-400"
          >
            <GripVertical size={18} />
          </button>
          <button
            onClick={() => onDuplicate(index)}
            className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-500 dark:text-blue-400"
            aria-label="Duplicate question"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={() => remove(index)}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400"
            aria-label="Remove question"
          >
            <X size={18} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Question Text
          </label>
          <Input
            {...control.register(`questions.${index}.questionText`)}
            placeholder="Enter question text"
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Question Type
          </label>
          <Controller
            control={control}
            name={`questions.${index}.type`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectItem value="multiple-choice">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {question.type === "multiple-choice" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Options
            </label>
            {["0", "1", "2", "3"].map((i) => (
              <Input
                key={i}
                {...control.register(`questions.${index}.options.${i}`)}
                placeholder={`Option ${parseInt(i) + 1}`}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            ))}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Correct Answer
          </label>
          <Input
            {...control.register(`questions.${index}.correctAnswer`)}
            placeholder={
              question.type === "multiple-choice"
                ? "Enter option letter (A, B, C, D)"
                : question.type === "true-false"
                ? "Enter True or False"
                : "Enter correct answer"
            }
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function EditExamModal({ exam, onClose }: EditExamModalProps) {
  const { updateExam } = useExams();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: exam.title,
      subject: exam.subject,
      questions: exam.questions.map((q) => ({
        ...q,
        options: q.options || [], // Ensure options is always an array
      })),
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((q) => q.id === active.id);
      const newIndex = fields.findIndex((q) => q.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const onSubmit = (data: ExamFormValues) => {
    setIsSubmitting(true);
    console.log("Submitting data:", data); // Add logging for debugging

    updateExam.mutate(
      { id: exam._id, data },
      {
        onSuccess: (response) => {
          console.log("Update successful:", response); // Add logging for debugging
          toast.success("Exam updated successfully");
          setHasUnsavedChanges(false);
          setIsSubmitting(false);
          onClose();
        },
        onError: (error) => {
          console.error("Update error:", error); // Add logging for debugging
          toast.error("Failed to update exam");
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleDuplicateQuestion = (index: number) => {
    const questionToDuplicate = watch(`questions.${index}`);
    append({
      ...questionToDuplicate,
      id: `question-${Date.now()}`, // Generate a unique ID
    });
    toast.success("Question duplicated");
  };

  const handleResetForm = () => {
    reset({
      title: exam.title,
      subject: exam.subject,
      questions: exam.questions.map((q) => ({
        ...q,
        options: q.options || [], // Ensure options is always an array
      })),
    });
    toast.info("Form reset to original values");
  };

  const watchedQuestions = watch("questions");

  // Calculate exam statistics
  const calculateExamStats = () => {
    const stats = {
      total: watchedQuestions.length,
      multipleChoice: 0,
      trueFalse: 0,
      shortAnswer: 0,
      essay: 0,
    };

    watchedQuestions.forEach((q) => {
      switch (q.type) {
        case "multiple-choice":
          stats.multipleChoice += 1;
          break;
        case "true-false":
          stats.trueFalse += 1;
          break;
        case "short-answer":
          stats.shortAnswer += 1;
          break;
        case "essay":
          stats.essay += 1;
          break;
      }
    });

    return stats;
  };

  const examStats = calculateExamStats();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Exam
            </h2>
            {hasUnsavedChanges && (
              <Badge
                variant="outline"
                className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
              >
                Unsaved Changes
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetForm}
              className="flex items-center gap-1"
            >
              <RotateCcw size={16} /> Reset
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <FileText size={16} /> Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye size={16} /> Preview
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 size={16} /> Statistics
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden flex">
            {/* Edit Tab */}
            <TabsContent
              value="edit"
              className="flex-1 overflow-y-auto m-0 data-[state=active]:flex p-0"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exam Title
                      </label>
                      <Input
                        {...register("title")}
                        placeholder="Enter exam title"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject
                      </label>
                      <Input
                        {...register("subject")}
                        placeholder="Enter subject"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Questions
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          append({
                            type: "short-answer" as QuestionType,
                            questionText: "",
                            options: [],
                            correctAnswer: "",
                            aiGenerated: false,
                          } as Question)
                        }
                        className="text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      >
                        Add Question
                      </Button>
                    </div>

                    {/* Display form errors if any */}
                    {errors.questions && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {errors.questions.root?.message ||
                            "Please fix the errors in the questions"}
                        </p>
                      </div>
                    )}

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={onDragEnd}
                    >
                      <SortableContext
                        items={fields.map((q) => q.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {fields.map((question, index) => (
                            <SortableQuestionCard
                              key={question.id}
                              question={question}
                              index={index}
                              control={control}
                              remove={remove}
                              onDuplicate={handleDuplicateQuestion}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} /> Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent
              value="preview"
              className="flex-1 overflow-y-auto m-0 data-[state=active]:flex p-0"
            >
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Exam Preview
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {watch("title")}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {watch("subject")}
                  </p>
                </div>
                <div className="space-y-4">
                  {watchedQuestions.map((q, idx) => (
                    <Card
                      key={idx}
                      className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                    >
                      <CardContent className="p-4">
                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                          <span className="text-indigo-600 dark:text-indigo-400">
                            Q{idx + 1}:
                          </span>{" "}
                          {q.questionText}
                        </p>
                        {q.type === "multiple-choice" &&
                          q.options?.map((opt, i) => (
                            <p
                              key={i}
                              className="ml-4 text-gray-700 dark:text-gray-300"
                            >
                              <span className="font-medium">
                                {String.fromCharCode(65 + i)}.
                              </span>{" "}
                              {opt}
                            </p>
                          ))}
                        <p className="mt-2 text-green-600 dark:text-green-400 font-medium">
                          Answer: {q.correctAnswer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent
              value="stats"
              className="flex-1 overflow-y-auto m-0 data-[state=active]:flex p-0"
            >
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Exam Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart3 size={18} /> Question Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Multiple Choice
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {examStats.multipleChoice}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (examStats.multipleChoice / examStats.total) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              True/False
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {examStats.trueFalse}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (examStats.trueFalse / examStats.total) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Short Answer
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {examStats.shortAnswer}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (examStats.shortAnswer / examStats.total) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Essay
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {examStats.essay}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (examStats.essay / examStats.total) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText size={18} /> Exam Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">
                            Total Questions
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
                          >
                            {examStats.total}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">
                            Subject
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                          >
                            {watch("subject")}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">
                            Status
                          </span>
                          {hasUnsavedChanges ? (
                            <Badge
                              variant="outline"
                              className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 flex items-center gap-1"
                            >
                              <AlertCircle size={14} /> Unsaved
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700 flex items-center gap-1"
                            >
                              <CheckCircle size={14} /> Saved
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">
                            Created
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {new Date(exam.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {examStats.multipleChoice > examStats.total * 0.7 && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Your exam has a high percentage of multiple-choice
                            questions. Consider adding more variety with short
                            answer or essay questions.
                          </p>
                        </div>
                      )}
                      {examStats.essay === 0 && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <div className="mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          </div>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            Consider adding at least one essay question to test
                            deeper understanding of the subject.
                          </p>
                        </div>
                      )}
                      {examStats.total < 5 && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          </div>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Your exam has fewer than 5 questions. Consider
                            adding more questions to provide a comprehensive
                            assessment.
                          </p>
                        </div>
                      )}
                      {examStats.total >= 10 &&
                        examStats.trueFalse > examStats.total * 0.3 && (
                          <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="mt-0.5">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            </div>
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                              Your exam has a good number of questions. Consider
                              reducing the percentage of true/false questions
                              for more challenging content.
                            </p>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
