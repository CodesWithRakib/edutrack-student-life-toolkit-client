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
  Assignment,
  CreateAssignmentData,
  UpdateAssignmentPayload,
} from "@/types/education";
import {
  useCreateAssignment,
  useUpdateAssignment,
} from "@/hooks/useAssignments";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  dueDate: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editAssignment: Assignment | null; // allow null
  onClose: () => void;
  onSuccess: () => void;
}

const AddAssignmentDialog: React.FC<AddAssignmentDialogProps> = ({
  open,
  onOpenChange,
  editAssignment,
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
      title: "",
      subject: "",
      dueDate: "",
      priority: "medium",
      description: "",
    },
  });

  // Import hooks
  const createAssignmentMutation = useCreateAssignment();
  const updateAssignmentMutation = useUpdateAssignment();

  // Pre-fill form when editing
  useEffect(() => {
    if (editAssignment) {
      setValue("title", editAssignment.title);
      setValue("subject", editAssignment.subject);
      setValue("dueDate", editAssignment.dueDate || "");
      setValue("priority", editAssignment.priority);
      setValue("description", editAssignment.description || "");
    } else {
      reset();
    }
  }, [editAssignment, setValue, reset]);

  const onSubmit = (values: FormValues) => {
    const payload: CreateAssignmentData = {
      title: values.title,
      subject: values.subject,
      dueDate: values.dueDate || undefined,
      priority: values.priority,
      description: values.description || undefined,
    };

    if (editAssignment && editAssignment._id) {
      const updatePayload: UpdateAssignmentPayload = {
        title: values.title,
        subject: values.subject,
        dueDate: values.dueDate || undefined,
        priority: values.priority,
        description: values.description || undefined,
      };

      updateAssignmentMutation.mutate(
        { id: editAssignment._id, updates: updatePayload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });

            toast.success("Assignment updated");
            onOpenChange(false);
            reset();
            if (onSuccess) onSuccess();
          },
          onError: (error) => {
            toast.error(
              `Failed to update assignment: ${error.message || "Unknown error"}`
            );
          },
        }
      );
    } else {
      createAssignmentMutation.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["assignments"] });
          toast.success("Assignment added");
          onOpenChange(false);
          reset();
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          toast.error(
            `Failed to add assignment: ${error.message || "Unknown error"}`
          );
        },
      });
    }
  };

  const selectedPriority = watch("priority");

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
  const isPending = editAssignment
    ? updateAssignmentMutation.isPending
    : createAssignmentMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-0 shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">
            {editAssignment ? "Edit Assignment" : "Add Assignment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Math Problem Set 5"
              className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-amber-500 focus:border-amber-500"
              {...register("title")}
            />
            {errors.title && (
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
                {errors.title.message}
              </p>
            )}
          </div>

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
              className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-amber-500 focus:border-amber-500"
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

          {/* Due Date & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="dueDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Due Date (Optional)
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                    📅
                  </span>
                </div>
                <Input
                  id="dueDate"
                  type="date"
                  className="pl-10 shadow-sm border-gray-200 dark:border-gray-700 focus:ring-amber-500 focus:border-amber-500"
                  {...register("dueDate")}
                />
              </div>
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
                <SelectTrigger className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-amber-500 focus:border-amber-500">
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

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Assignment details"
              className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-amber-500 focus:border-amber-500"
              rows={3}
              {...register("description")}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full shadow-md bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
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
                {editAssignment ? "Updating..." : "Adding..."}
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
                {editAssignment ? "Update Assignment" : "Add Assignment"}
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignmentDialog;
