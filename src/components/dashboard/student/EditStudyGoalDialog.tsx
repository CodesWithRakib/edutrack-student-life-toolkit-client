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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studyGoalService } from "@/services/studyGoalService";
import { toast } from "sonner";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  targetHours: z.coerce.number().min(1, "Target hours must be at least 1"),
  period: z.enum(["daily", "weekly", "monthly"]).default("weekly"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditStudyGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studyGoal: FormValues & { _id: string }; // existing study goal to edit
}

const EditStudyGoalDialog: React.FC<EditStudyGoalDialogProps> = ({
  open,
  onOpenChange,
  studyGoal,
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

  // Prefill form when studyGoal changes
  useEffect(() => {
    if (studyGoal) {
      reset({
        subject: studyGoal.subject,
        targetHours: studyGoal.targetHours,
        period: studyGoal.period,
        startDate: studyGoal.startDate || "",
        endDate: studyGoal.endDate || "",
      });
    }
  }, [studyGoal, reset]);

  const updateStudyGoalMutation = useMutation({
    mutationFn: (payload: FormValues & { id: string }) =>
      studyGoalService.updateStudyGoal(payload.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-goals"] });
      toast.success("Study goal updated successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update study goal"
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    const payload = {
      id: studyGoal._id,
      ...values,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    };
    updateStudyGoalMutation.mutate(payload);
  };

  const selectedPeriod = watch("period");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Study Goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Target Hours */}
          <div className="space-y-2">
            <Label htmlFor="targetHours">Target Hours</Label>
            <Input
              id="targetHours"
              type="number"
              step="0.5"
              min={1}
              {...register("targetHours", { valueAsNumber: true })}
            />
            {errors.targetHours && (
              <p className="text-sm text-destructive">
                {errors.targetHours.message}
              </p>
            )}
          </div>

          {/* Period */}
          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select
              value={selectedPeriod}
              onValueChange={(value: "daily" | "weekly" | "monthly") =>
                setValue("period", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional Start & End Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date (Optional)</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={updateStudyGoalMutation.isPending}
          >
            {updateStudyGoalMutation.isPending
              ? "Updating..."
              : "Update Study Goal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudyGoalDialog;
