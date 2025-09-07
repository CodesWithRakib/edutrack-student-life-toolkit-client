"use client";
import {
  useForm,
  useFieldArray,
  Controller,
  type Control,
  type UseFormReturn,
  type FieldArrayWithId,
  type UseFieldArrayReturn,
} from "react-hook-form";
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
import type { Exam, Question, QuestionType, QuestionInput } from "@/types/exam";
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
  RotateCcw,
  Save,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

interface EditExamModalProps {
  exam: Exam;
  onClose: () => void;
}

// Create a form-specific question type that matches your schema
interface FormQuestion {
  _id?: string; // only for existing questions from MongoDB
  id: string; // required for form rendering / DnD
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  aiGenerated?: boolean;
}

// Zod schema for exam details
const examDetailsSchema = z.object({
  title: z.string().min(1, "Exam title is required"),
  subject: z.string().min(1, "Subject is required"),
});

// Zod schema for questions array
const questionsArraySchema = z.object({
  questions: z.array(
    z.object({
      _id: z.string().optional(),
      id: z.string(),
      type: z.enum(["multiple-choice", "true-false", "short-answer", "essay"]),
      questionText: z.string().min(1, "Question text is required"),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string().min(1, "Correct answer is required"),
      aiGenerated: z.boolean().optional(),
    })
  ),
});

// Schema for new question form
const newQuestionSchema = z.object({
  type: z.enum(["multiple-choice", "true-false", "short-answer", "essay"]),
  questionText: z.string().min(1, "Question text is required"),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

type ExamDetailsFormValues = z.infer<typeof examDetailsSchema>;
type QuestionsFormValues = z.infer<typeof questionsArraySchema>;
type NewQuestionFormValues = z.infer<typeof newQuestionSchema>;

// Props for SortableQuestionCard
interface SortableQuestionCardProps {
  question: FieldArrayWithId<QuestionsFormValues, "questions", "id">;
  index: number;
  control: Control<QuestionsFormValues>;
  remove: (index: number) => void;
  register: UseFormReturn<QuestionsFormValues>["register"];
}

// Sortable Question Card
function SortableQuestionCard({
  question,
  index,
  control,
  remove,
  register,
}: SortableQuestionCardProps) {
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
            {...register(`questions.${index}.questionText`)}
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
            {[0, 1, 2, 3].map((i) => (
              <Input
                key={i}
                {...register(`questions.${index}.options.${i}` as const)}
                placeholder={`Option ${i + 1}`}
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
            {...register(`questions.${index}.correctAnswer`)}
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

// Helper function to convert FormQuestion to Question
const convertFormQuestionToQuestion = (
  formQuestion: FormQuestion
): Question => {
  const baseQuestion = {
    _id: formQuestion._id || "",
    questionText: formQuestion.questionText,
    aiGenerated: formQuestion.aiGenerated ?? false,
  };

  switch (formQuestion.type) {
    case "multiple-choice":
      return {
        ...baseQuestion,
        type: "multiple-choice",
        options: formQuestion.options || [],
        correctAnswer: formQuestion.correctAnswer,
      };
    case "true-false":
      return {
        ...baseQuestion,
        type: "true-false",
        correctAnswer:
          formQuestion.correctAnswer.toLowerCase() === "true"
            ? "True"
            : "False",
      };
    case "short-answer":
      return {
        ...baseQuestion,
        type: "short-answer",
        correctAnswer: formQuestion.correctAnswer,
      };
    case "essay":
      return {
        ...baseQuestion,
        type: "essay",
        correctAnswer: formQuestion.correctAnswer,
      };
  }
};

// Helper function to convert NewQuestionFormValues to QuestionInput
const convertNewQuestionToQuestionInput = (
  data: NewQuestionFormValues
): QuestionInput => {
  const baseQuestion = {
    questionText: data.questionText,
    aiGenerated: false,
  };

  switch (data.type) {
    case "multiple-choice":
      return {
        ...baseQuestion,
        type: "multiple-choice",
        options: data.options || [],
        correctAnswer: data.correctAnswer,
      };
    case "true-false":
      return {
        ...baseQuestion,
        type: "true-false",
        correctAnswer:
          data.correctAnswer.toLowerCase() === "true" ? "True" : "False",
      };
    case "short-answer":
      return {
        ...baseQuestion,
        type: "short-answer",
        correctAnswer: data.correctAnswer,
      };
    case "essay":
      return {
        ...baseQuestion,
        type: "essay",
        correctAnswer: data.correctAnswer,
      };
  }
};

// Helper function to convert QuestionInput to Question with temporary ID
const convertQuestionInputToQuestion = (
  questionInput: QuestionInput,
  index: number
): Question => {
  const baseQuestion = {
    _id: `temp-${Date.now()}-${index}`,
    questionText: questionInput.questionText,
    aiGenerated: questionInput.aiGenerated ?? false,
  };

  switch (questionInput.type) {
    case "multiple-choice":
      return {
        ...baseQuestion,
        type: "multiple-choice",
        options: questionInput.options || [],
        correctAnswer: questionInput.correctAnswer,
      };
    case "true-false":
      return {
        ...baseQuestion,
        type: "true-false",
        correctAnswer: questionInput.correctAnswer,
      };
    case "short-answer":
      return {
        ...baseQuestion,
        type: "short-answer",
        correctAnswer: questionInput.correctAnswer,
      };
    case "essay":
      return {
        ...baseQuestion,
        type: "essay",
        correctAnswer: questionInput.correctAnswer,
      };
  }
};

export function EditExamModal({ exam, onClose }: EditExamModalProps) {
  const { updateExam, addQuestions } = useExams();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newQuestions, setNewQuestions] = useState<QuestionInput[]>([]);

  // Convert Exam questions to FormQuestions
  const convertQuestionsToFormQuestions = (
    questions: Question[]
  ): FormQuestion[] => {
    return questions.map((q) => ({
      _id: q._id, // existing DB id
      id: q._id, // for DnD rendering
      type: q.type,
      questionText: q.questionText,
      options: q.type === "multiple-choice" ? q.options : [],
      correctAnswer: q.correctAnswer,
      aiGenerated: q.aiGenerated,
    }));
  };

  // Form for exam details
  const {
    register: registerExam,
    handleSubmit: handleExamSubmit,
    reset: resetExam,
    formState: { errors: examErrors, isDirty: examIsDirty },
  } = useForm<ExamDetailsFormValues>({
    resolver: zodResolver(examDetailsSchema),
    defaultValues: {
      title: exam.title,
      subject: exam.subject,
    },
  });

  // Form for questions
  const {
    control: controlQuestion,
    handleSubmit: handleQuestionSubmit,
    register: registerQuestion,
    reset: resetQuestion,
    formState: { isDirty: questionIsDirty },
  } = useForm<QuestionsFormValues>({
    resolver: zodResolver(questionsArraySchema),
    defaultValues: {
      questions: convertQuestionsToFormQuestions(exam.questions),
    },
  });

  // Form for new questions
  const {
    register: registerNewQuestion,
    handleSubmit: handleNewQuestionSubmit,
    control: controlNewQuestion,
    reset: resetNewQuestion,
    watch: watchNewQuestion,
    formState: { errors: newQuestionErrors },
  } = useForm<NewQuestionFormValues>({
    resolver: zodResolver(newQuestionSchema),
    defaultValues: {
      type: "short-answer",
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  });

  const {
    fields,
    remove,
    move,
  }: UseFieldArrayReturn<QuestionsFormValues, "questions", "id"> =
    useFieldArray({
      control: controlQuestion,
      name: "questions",
    });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(
      examIsDirty || questionIsDirty || newQuestions.length > 0
    );
  }, [examIsDirty, questionIsDirty, newQuestions.length]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((q) => q.id === active.id);
      const newIndex = fields.findIndex((q) => q.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  // Handle exam details submission
  const onSubmitExamDetails = (data: ExamDetailsFormValues) => {
    setIsSubmitting(true);
    updateExam.mutate(
      {
        id: exam._id,
        data: {
          ...data,
          difficulty: exam.difficulty,
          questions: exam.questions, // Keep existing questions unchanged
        },
      },
      {
        onSuccess: () => {
          toast.success("Exam details updated successfully");
          setIsSubmitting(false);
          resetExam(data); // Reset form state to new values
        },
        onError: () => {
          toast.error("Failed to update exam details");
          setIsSubmitting(false);
        },
      }
    );
  };

  // Handle question updates
  const onSubmitQuestions = (data: QuestionsFormValues) => {
    setIsSubmitting(true);

    // Convert form data to Question type using our helper function
    const updatedQuestions: Question[] = data.questions.map((q) =>
      convertFormQuestionToQuestion(q as FormQuestion)
    );

    updateExam.mutate(
      {
        id: exam._id,
        data: {
          title: exam.title,
          subject: exam.subject,
          difficulty: exam.difficulty,
          questions: updatedQuestions,
        },
      },
      {
        onSuccess: () => {
          toast.success("Questions updated successfully");
          setIsSubmitting(false);
          resetQuestion({
            questions: convertQuestionsToFormQuestions(updatedQuestions),
          });
        },
        onError: () => {
          toast.error("Failed to update questions");
          setIsSubmitting(false);
        },
      }
    );
  };

  // Handle adding new questions
  const onAddNewQuestion = (data: NewQuestionFormValues) => {
    // Convert form data to QuestionInput type using our helper function
    const newQuestion: QuestionInput = convertNewQuestionToQuestionInput(data);

    setNewQuestions([...newQuestions, newQuestion]);
    resetNewQuestion();
    toast.success("Question added to list");
  };

  // Submit all new questions
  const onSubmitAllNewQuestions = () => {
    if (newQuestions.length === 0) {
      toast.error("No questions to add");
      return;
    }

    setIsSubmitting(true);

    // Convert QuestionInput[] to Question[] with temporary IDs
    const questionsToAdd: Question[] = newQuestions.map((q, index) =>
      convertQuestionInputToQuestion(q, index)
    );

    addQuestions.mutate(
      {
        id: exam._id,
        questions: questionsToAdd,
      },
      {
        onSuccess: () => {
          toast.success("Questions added successfully");
          setNewQuestions([]);
          setIsSubmitting(false);

          // Refresh the questions list by updating the form with the new questions
          // Note: We don't have the actual _ids from the server yet, so we'll use temporary ones
          const updatedQuestions = [
            ...exam.questions,
            ...questionsToAdd,
          ] as Question[];

          resetQuestion({
            questions: convertQuestionsToFormQuestions(updatedQuestions),
          });
        },
        onError: () => {
          toast.error("Failed to add questions");
          setIsSubmitting(false);
        },
      }
    );
  };

  // Remove a new question from the list
  const removeNewQuestion = (index: number) => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions.splice(index, 1);
    setNewQuestions(updatedQuestions);
  };

  const handleResetForm = () => {
    resetExam({
      title: exam.title,
      subject: exam.subject,
    });
    resetQuestion({
      questions: convertQuestionsToFormQuestions(exam.questions),
    });
    setNewQuestions([]);
    toast.info("Form reset to original values");
  };

  // Calculate exam statistics
  const calculateExamStats = () => {
    const stats = {
      total: fields.length + newQuestions.length,
      multipleChoice: 0,
      trueFalse: 0,
      shortAnswer: 0,
      essay: 0,
    };

    // Count existing questions
    fields.forEach((q) => {
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

    // Count new questions
    newQuestions.forEach((q) => {
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
          <TabsList className="grid w-full grid-cols-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <FileText size={16} /> Edit Details
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <FileText size={16} /> Questions
            </TabsTrigger>
            <TabsTrigger
              value="add-questions"
              className="flex items-center gap-2"
            >
              <Plus size={16} /> Add Questions
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 size={16} /> Statistics
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden flex">
            {/* Edit Exam Details Tab */}
            <TabsContent
              value="edit"
              className="flex-1 overflow-y-auto m-0 data-[state=active]:flex p-0"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <form
                  onSubmit={handleExamSubmit(onSubmitExamDetails)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exam Title
                      </label>
                      <Input
                        {...registerExam("title")}
                        placeholder="Enter exam title"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                      {examErrors.title && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {examErrors.title.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject
                      </label>
                      <Input
                        {...registerExam("subject")}
                        placeholder="Enter subject"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                      {examErrors.subject && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {examErrors.subject.message}
                        </p>
                      )}
                    </div>
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

            {/* Edit Questions Tab */}
            <TabsContent
              value="questions"
              className="flex-1 overflow-y-auto m-0 data-[state=active]:flex p-0"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Existing Questions
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Edit and reorder existing questions
                  </p>
                </div>

                {fields.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No questions found
                    </p>
                  </div>
                ) : (
                  <>
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
                            <div key={question.id}>
                              <SortableQuestionCard
                                question={question}
                                index={index}
                                control={controlQuestion}
                                remove={remove}
                                register={registerQuestion}
                              />
                            </div>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleQuestionSubmit(onSubmitQuestions)}
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        {isSubmitting ? "Saving..." : "Save All Questions"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Add Questions Tab */}
            <TabsContent
              value="add-questions"
              className="flex-1 overflow-y-auto m-0 data-[state=active]:flex p-0"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Add New Questions
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create new questions to add to this exam
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* New Question Form */}
                  <div>
                    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                          Create New Question
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form
                          onSubmit={handleNewQuestionSubmit(onAddNewQuestion)}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Question Type
                            </label>
                            <Controller
                              control={controlNewQuestion}
                              name="type"
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                    <SelectItem value="multiple-choice">
                                      Multiple Choice
                                    </SelectItem>
                                    <SelectItem value="true-false">
                                      True/False
                                    </SelectItem>
                                    <SelectItem value="short-answer">
                                      Short Answer
                                    </SelectItem>
                                    <SelectItem value="essay">Essay</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Question Text
                            </label>
                            <Input
                              {...registerNewQuestion("questionText")}
                              placeholder="Enter question text"
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            />
                            {newQuestionErrors.questionText && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {newQuestionErrors.questionText.message}
                              </p>
                            )}
                          </div>

                          {watchNewQuestion("type") === "multiple-choice" && (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Options
                              </label>
                              {[0, 1, 2, 3].map((i) => (
                                <Input
                                  key={i}
                                  {...registerNewQuestion(
                                    `options.${i}` as const
                                  )}
                                  placeholder={`Option ${i + 1}`}
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
                              {...registerNewQuestion("correctAnswer")}
                              placeholder={
                                watchNewQuestion("type") === "multiple-choice"
                                  ? "Enter option letter (A, B, C, D)"
                                  : watchNewQuestion("type") === "true-false"
                                  ? "Enter True or False"
                                  : "Enter correct answer"
                              }
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            />
                            {newQuestionErrors.correctAnswer && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {newQuestionErrors.correctAnswer.message}
                              </p>
                            )}
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            Add to List
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>

                  {/* New Questions List */}
                  <div>
                    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm h-full">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                          Questions to Add ({newQuestions.length})
                        </CardTitle>
                        <Button
                          onClick={onSubmitAllNewQuestions}
                          disabled={isSubmitting || newQuestions.length === 0}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isSubmitting ? "Adding..." : "Add All Questions"}
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {newQuestions.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                              No questions added yet
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {newQuestions.map((question, index) => (
                              <Card
                                key={index}
                                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                              >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                  <CardTitle className="text-base font-medium text-gray-900 dark:text-white">
                                    Question {index + 1}
                                  </CardTitle>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeNewQuestion(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <X size={16} />
                                  </Button>
                                </CardHeader>
                                <CardContent>
                                  <p className="font-medium text-gray-900 dark:text-white mb-2">
                                    {question.questionText}
                                  </p>
                                  {question.type === "multiple-choice" &&
                                    question.options && (
                                      <div className="ml-4 space-y-1">
                                        {question.options.map((opt, i) => (
                                          <p
                                            key={i}
                                            className="text-gray-700 dark:text-gray-300"
                                          >
                                            <span className="font-medium">
                                              {String.fromCharCode(65 + i)}.
                                            </span>{" "}
                                            {opt}
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                  <p className="mt-2 text-green-600 dark:text-green-400 font-medium">
                                    Answer: {question.correctAnswer}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
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
                            Existing Questions
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                          >
                            {fields.length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">
                            New Questions
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
                          >
                            {newQuestions.length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">
                            Subject
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700"
                          >
                            {exam.subject}
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
