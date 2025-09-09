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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import type {
  StudyGoal,
  CreateStudyGoalData,
  UpdateStudyGoalPayload,
} from "@/types/education";
import { useCreateStudyGoal, useUpdateStudyGoal } from "@/hooks/useStudyGoals";
import type { AxiosError } from "axios";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  targetHours: z.number().min(1, "Target hours must be at least 1"),
  period: z.enum(["daily", "weekly", "monthly"]),
  startDate: z.string(),
  endDate: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddStudyGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editGoal: StudyGoal | null; // allow null
  onClose: () => void;
  onSuccess: () => void;
}

const AddStudyGoalDialog: React.FC<AddStudyGoalDialogProps> = ({
  open,
  onOpenChange,
  editGoal,
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
      targetHours: 10,
      period: "weekly",
      startDate: "",
      endDate: "",
    },
  });

  // Import hooks
  const createStudyGoalMutation = useCreateStudyGoal();
  const updateStudyGoalMutation = useUpdateStudyGoal();

  // Pre-fill form if editing
  useEffect(() => {
    if (editGoal) {
      setValue("subject", editGoal.subject);
      setValue("targetHours", editGoal.targetHours);
      setValue("period", editGoal.period);
      setValue("startDate", editGoal.startDate || "");
      setValue("endDate", editGoal.endDate || "");
    } else {
      reset();
    }
  }, [editGoal, setValue, reset]);

  const onSubmit = (values: FormValues) => {
    if (editGoal && editGoal._id) {
      const updatePayload: UpdateStudyGoalPayload = {
        subject: values.subject,
        targetHours: values.targetHours,
        period: values.period,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
      };

      updateStudyGoalMutation.mutate(
        { id: editGoal._id, updates: updatePayload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studyGoals"] });
            toast.success("Study goal updated");
            onOpenChange(false);
            reset();
            if (onSuccess) onSuccess();
          },
          onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(
              axiosError.response?.data?.message ||
                "Failed to update study goal"
            );
          },
        }
      );
    } else {
      const createPayload: CreateStudyGoalData = {
        subject: values.subject,
        targetHours: values.targetHours,
        period: values.period,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
      };

      createStudyGoalMutation.mutate(createPayload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["studyGoals"] });
          toast.success("Study goal added");
          onOpenChange(false);
          reset();
          if (onSuccess) onSuccess();
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<{ message: string }>;
          toast.error(
            axiosError.response?.data?.message || "Failed to add study goal"
          );
        },
      });
    }
  };

  const selectedPeriod = watch("period");

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
  const isPending = editGoal
    ? updateStudyGoalMutation.isPending
    : createStudyGoalMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-0 shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
            {editGoal ? "Edit Study Goal" : "Add Study Goal"}
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
              className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-green-500 focus:border-green-500"
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

          {/* Target Hours */}
          <div className="space-y-2">
            <Label
              htmlFor="targetHours"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Target Hours <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                  ⏱️
                </span>
              </div>
              <Input
                id="targetHours"
                type="number"
                step="0.5"
                min="1"
                className="pl-10 shadow-sm border-gray-200 dark:border-gray-700 focus:ring-green-500 focus:border-green-500"
                {...register("targetHours", { valueAsNumber: true })}
              />
            </div>
            {errors.targetHours && (
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
                {errors.targetHours.message}
              </p>
            )}
          </div>

          {/* Period */}
          <div className="space-y-2">
            <Label
              htmlFor="period"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Period <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedPeriod}
              onValueChange={(value: "daily" | "weekly" | "monthly") =>
                setValue("period", value)
              }
            >
              <SelectTrigger className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-green-500 focus:border-green-500">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily" className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Daily
                </SelectItem>
                <SelectItem value="weekly" className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  Weekly
                </SelectItem>
                <SelectItem value="monthly" className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  Monthly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Start Date (Optional)
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                    📅
                  </span>
                </div>
                <Input
                  id="startDate"
                  type="date"
                  className="pl-10 shadow-sm border-gray-200 dark:border-gray-700 focus:ring-green-500 focus:border-green-500"
                  {...register("startDate")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                End Date (Optional)
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                    📅
                  </span>
                </div>
                <Input
                  id="endDate"
                  type="date"
                  className="pl-10 shadow-sm border-gray-200 dark:border-gray-700 focus:ring-green-500 focus:border-green-500"
                  {...register("endDate")}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full shadow-md bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
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
                {editGoal ? "Updating..." : "Adding..."}
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
                {editGoal ? "Update Goal" : "Add Study Goal"}
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudyGoalDialog;
