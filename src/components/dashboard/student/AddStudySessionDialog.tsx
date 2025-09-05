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
import { studySessionService } from "@/services/studySessionService";
import { toast } from "sonner";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  duration: z.string().min(1, "Duration is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddStudySessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editSession?: FormValues & { _id: string };
}

const AddStudySessionDialog: React.FC<AddStudySessionDialogProps> = ({
  open,
  onOpenChange,
  editSession,
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

  // Pre-fill form when editing
  useEffect(() => {
    if (editSession) {
      setValue("subject", editSession.subject);
      setValue("topic", editSession.topic);
      setValue("duration", editSession.duration);
      setValue("date", editSession.date);
      setValue("time", editSession.time);
      setValue("priority", editSession.priority);
      setValue("notes", editSession.notes || "");
    } else {
      reset();
    }
  }, [editSession, setValue, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      editSession
        ? studySessionService.updateStudySession(editSession._id, values)
        : studySessionService.createStudySession(values),
    onSuccess: () => {
      queryClient.invalidateQueries(["study-sessions"]);
      toast.success(
        editSession ? "Study session updated" : "Study session added"
      );
      onOpenChange(false);
      reset();
    },
    onError: () => {
      toast.error(
        editSession
          ? "Failed to update study session"
          : "Failed to add study session"
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  const selectedPriority = watch("priority");
  const selectedDuration = watch("duration");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editSession ? "Edit Study Session" : "Add Study Session"}
          </DialogTitle>
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

          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Calculus - Derivatives"
              {...register("topic")}
            />
            {errors.topic && (
              <p className="text-sm text-destructive">{errors.topic.message}</p>
            )}
          </div>

          {/* Duration & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={selectedDuration}
                onValueChange={(value) => setValue("duration", value)}
              >
                <SelectTrigger>
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
                <p className="text-sm text-destructive">
                  {errors.duration.message}
                </p>
              )}
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

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" {...register("time")} />
              {errors.time && (
                <p className="text-sm text-destructive">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes"
              {...register("notes")}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? editSession
                ? "Updating..."
                : "Adding..."
              : editSession
              ? "Update Study Session"
              : "Add Study Session"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudySessionDialog;
