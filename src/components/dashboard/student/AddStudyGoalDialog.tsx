import React from "react";
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
});

interface AddStudyGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStudyGoalDialog: React.FC<AddStudyGoalDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      targetHours: 10,
      period: "weekly",
    },
  });

  const createStudyGoalMutation = useMutation({
    mutationFn: studyGoalService.createStudyGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-goals"] });
      toast.success("Study goal added successfully");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add study goal");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createStudyGoalMutation.mutate(values);
  };

  const selectedPeriod = watch("period");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Study Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="targetHours">Target Hours</Label>
            <Input
              id="targetHours"
              type="number"
              step="0.5"
              min="1"
              {...register("targetHours", { valueAsNumber: true })}
            />
            {errors.targetHours && (
              <p className="text-sm text-destructive">
                {errors.targetHours.message}
              </p>
            )}
          </div>

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

          <Button
            type="submit"
            className="w-full"
            disabled={createStudyGoalMutation.isPending}
          >
            {createStudyGoalMutation.isPending ? "Adding..." : "Add Study Goal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudyGoalDialog;
