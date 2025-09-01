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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { classService } from "@/services/classService";
import { toast } from "sonner";
import type { Class } from "@/types/class";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  instructor: z.string().min(1, "Instructor is required"),
  type: z.enum(["lecture", "lab", "tutorial", "discussion"]),
  day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().min(1, "Duration must be at least 1 minute").optional(),
  recurring: z.boolean().default(true),
});

interface EditClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: Class;
}

const EditClassDialog: React.FC<EditClassDialogProps> = ({
  open,
  onOpenChange,
  classData,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: classData.title,
      startTime: classData.startTime,
      endTime: classData.endTime,
      location: classData.location,
      instructor: classData.instructor,
      type: classData.type,
      day: classData.day,
      description: classData.description || "",
      durationMinutes: classData.durationMinutes || 60,
      recurring: classData.recurring || true,
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: (updates: Partial<z.infer<typeof formSchema>>) =>
      classService.updateClass(classData._id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-classes"] });
      toast.success("Class updated successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update class");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateClassMutation.mutate(values);
  };

  const selectedType = watch("type");
  const selectedDay = watch("day");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Class Title</Label>
            <Input
              id="title"
              placeholder="e.g., Mathematics - Calculus"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Type Field */}
          <div className="space-y-2">
            <Label htmlFor="type">Class Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value: "lecture" | "lab" | "tutorial" | "discussion") => 
                setValue("type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lecture">Lecture</SelectItem>
                <SelectItem value="lab">Lab</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="discussion">Discussion</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Day Field */}
          <div className="space-y-2">
            <Label htmlFor="day">Day</Label>
            <Select
              value={selectedDay}
              onValueChange={(value: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday") => 
                setValue("day", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
            {errors.day && (
              <p className="text-sm text-destructive">{errors.day.message}</p>
            )}
          </div>

          {/* Time Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                {...register("startTime")}
              />
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                {...register("endTime")}
              />
              {errors.endTime && (
                <p className="text-sm text-destructive">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Room 301"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          {/* Instructor Field */}
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              placeholder="e.g., Dr. Smith"
              {...register("instructor")}
            />
            {errors.instructor && (
              <p className="text-sm text-destructive">{errors.instructor.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Class description or notes"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={updateClassMutation.isPending}
          >
            {updateClassMutation.isPending ? "Updating..." : "Update Class"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassDialog;