import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type {
  StudySession,
  CreateStudySessionPayload,
  UpdateStudySessionPayload,
} from "@/types/education";
import {
  useCreateStudySession,
  useUpdateStudySession,
} from "@/hooks/useStudySessions";
import type { AxiosError } from "axios";

// Helper function to convert duration string to minutes
const durationToMinutes = (duration: string): number => {
  switch (duration) {
    case "30 minutes":
      return 30;
    case "1 hour":
      return 60;
    case "1.5 hours":
      return 90;
    case "2 hours":
      return 120;
    case "3 hours":
      return 180;
    default:
      return 60; // Default to 1 hour
  }
};

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  duration: z.string().min(1, "Duration is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  priority: z.enum(["high", "medium", "low"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddStudySessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editSession: StudySession | null; // <-- allow null
  onClose: () => void;
  onSuccess: () => void;
}

const AddStudySessionDialog: React.FC<AddStudySessionDialogProps> = ({
  open,
  onOpenChange,
  editSession,
  onSuccess,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      topic: "",
      duration: "1 hour",
      date: new Date().toISOString().split("T")[0],
      time: "14:00",
      priority: "medium",
      notes: "",
    },
  });

  // Import hooks
  const createStudySessionMutation = useCreateStudySession();
  const updateStudySessionMutation = useUpdateStudySession();

  // Pre-fill form when editing
  useEffect(() => {
    if (editSession) {
      setValue("subject", editSession.subject);
      setValue("topic", editSession.topic);

      // Convert durationMinutes to readable string
      const durationStr =
        editSession.durationMinutes === 30
          ? "30 minutes"
          : editSession.durationMinutes === 60
          ? "1 hour"
          : editSession.durationMinutes === 90
          ? "1.5 hours"
          : editSession.durationMinutes === 120
          ? "2 hours"
          : editSession.durationMinutes === 180
          ? "3 hours"
          : "1 hour";

      setValue("duration", durationStr);
      setValue("date", editSession.date);
      setValue("time", editSession.time);
      setValue("priority", editSession.priority || "medium");
      setValue("notes", editSession.notes || "");
    } else {
      reset();
    }
  }, [editSession, setValue, reset]);

  const onSubmit = (values: FormValues) => {
    const durationMinutes = durationToMinutes(values.duration);

    if (editSession && editSession._id) {
      const updatePayload: UpdateStudySessionPayload = {
        subject: values.subject,
        topic: values.topic,
        durationMinutes,
        date: values.date,
        time: values.time,
        priority: values.priority,
        notes: values.notes || undefined,
      };

      updateStudySessionMutation.mutate(
        { id: editSession._id, updates: updatePayload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studySessions"] });
            toast.success("Study session updated");
            onOpenChange(false);
            reset();
            if (onSuccess) onSuccess();
          },
          onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(
              axiosError.response?.data?.message ||
                "Failed to update study session"
            );
          },
        }
      );
    } else {
      const createPayload: CreateStudySessionPayload = {
        subject: values.subject,
        topic: values.topic,
        durationMinutes,
        date: values.date,
        time: values.time,
        priority: values.priority,
        notes: values.notes || undefined,
      };

      createStudySessionMutation.mutate(createPayload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["studySessions"] });
          toast.success("Study session added");
          onOpenChange(false);
          reset();
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          toast.error(
            axiosError.response?.data?.message || "Failed to add study session"
          );
        },
      });
    }
  };

  const selectedPriority = watch("priority");
  const selectedDuration = watch("duration");

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    onOpenChange(open);
    if (!open && onClose) {
      onClose();
    }
    if (!open) {
      reset();
    }
  };

  // Determine if we're in a loading state
  const isPending = editSession
    ? updateStudySessionMutation.isPending
    : createStudySessionMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-0 shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            {editSession ? "Edit Study Session" : "Add Study Session"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label
              htmlFor="subject"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="e.g., Mathematics"
              className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-sm text-red-500 flex items-center gap-1">
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
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label
              htmlFor="topic"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Topic <span className="text-red-500">*</span>
            </Label>
            <Input
              id="topic"
              placeholder="e.g., Calculus - Derivatives"
              className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              {...register("topic")}
            />
            {errors.topic && (
              <p className="text-sm text-red-500 flex items-center gap-1">
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
                {errors.topic.message}
              </p>
            )}
          </div>

          {/* Duration & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="duration"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Duration <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedDuration}
                onValueChange={(value) => setValue("duration", value)}
              >
                <SelectTrigger className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                  <SelectItem value="2 hours">2 hours</SelectItem>
                  <SelectItem value="3 hours">3 hours</SelectItem>
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-sm text-red-500 flex items-center gap-1">
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
                  {errors.duration.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedPriority}
                onValueChange={(value: "high" | "medium" | "low") =>
                  setValue("priority", value)
                }
              >
                <SelectTrigger className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high" className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    High
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="flex items-center gap-2"
                  >
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    Medium
                  </SelectItem>
                  <SelectItem value="low" className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                {...register("date")}
              />
              {errors.date && (
                <p className="text-sm text-red-500 flex items-center gap-1">
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
                  {errors.date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="time"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                {...register("time")}
              />
              {errors.time && (
                <p className="text-sm text-red-500 flex items-center gap-1">
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
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional notes"
              className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              {...register("notes")}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                {editSession ? "Updating..." : "Adding..."}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                {editSession ? "Update Study Session" : "Add Study Session"}
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudySessionDialog;
