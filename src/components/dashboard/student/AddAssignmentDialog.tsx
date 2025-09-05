import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { assignmentService } from "@/services/assignmentService";
import { toast } from "sonner";
import type { Assignment } from "@/types/education";

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
  editAssignment?: FormValues & { _id: string };
}

const AddAssignmentDialog: React.FC<AddAssignmentDialogProps> = ({
  open,
  onOpenChange,
  editAssignment,
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

  const mutation = useMutation<Assignment, Error, FormValues>({
    mutationFn: (values: FormValues) => {
      if (editAssignment && editAssignment._id) {
        return assignmentService.updateAssignment(editAssignment._id, values);
      }
      return assignmentService.createAssignment(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assignments"]);
      toast.success(editAssignment ? "Assignment updated" : "Assignment added");
      onOpenChange(false);
      reset();
    },
    onError: () => {
      toast.error(
        editAssignment
          ? "Failed to update assignment"
          : "Failed to add assignment"
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      dueDate: values.dueDate || undefined,
      description: values.description || undefined,
    };
    mutation.mutate(payload);
  };

  const selectedPriority = watch("priority");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editAssignment ? "Edit Assignment" : "Add Assignment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Math Problem Set 5"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Mathematics"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Due Date & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={selectedPriority}
                onValueChange={(value: "high" | "medium" | "low") =>
                  setValue("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Assignment details"
              {...register("description")}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? editAssignment
                ? "Updating..."
                : "Adding..."
              : editAssignment
              ? "Update Assignment"
              : "Add Assignment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignmentDialog;
