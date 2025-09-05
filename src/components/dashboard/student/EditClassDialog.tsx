import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Class } from "@/types/class";

// ✅ strict schema (matches backend now)
const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    location: z.string().min(1, "Location is required"),
    instructor: z.string().min(1, "Instructor is required"),
    type: z.enum(["lecture", "lab", "tutorial", "discussion"]),
    day: z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]),
    description: z.string().optional(),
    recurring: z.enum(["none", "daily", "weekly"]),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

type FormValues = z.infer<typeof formSchema>;
type ClassType = FormValues["type"];
type ClassDay = FormValues["day"];
type RecurringType = FormValues["recurring"];

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
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
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
      recurring: (classData.recurring as RecurringType) ?? "weekly",
    },
  });

  const updateClassMutation = useMutation<Class, Error, FormValues>({
    mutationFn: (data) => classService.updateClass(classData._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-classes"] });
      toast.success("Class updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(
        `Failed to update class: ${error.message || "Unknown error"}`
      );
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    updateClassMutation.mutate(data);
  };

  const selectedType: ClassType = watch("type");
  const selectedDay: ClassDay = watch("day");
  const selectedRecurring: RecurringType = watch("recurring");

  const setType = (value: ClassType) => setValue("type", value);
  const setDay = (value: ClassDay) => setValue("day", value);
  const setRecurring = (value: RecurringType) => setValue("recurring", value);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="required">
                  Class Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Mathematics - Calculus"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="required">
                    Class Type
                  </Label>
                  <Select value={selectedType} onValueChange={setType}>
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
                    <p className="text-sm text-destructive">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="day" className="required">
                    Day
                  </Label>
                  <Select value={selectedDay} onValueChange={setDay}>
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
                    <p className="text-sm text-destructive">
                      {errors.day.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="required">
                  Start Time
                </Label>
                <Input id="startTime" type="time" {...register("startTime")} />
                {errors.startTime && (
                  <p className="text-sm text-destructive">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="required">
                  End Time
                </Label>
                <Input id="endTime" type="time" {...register("endTime")} />
                {errors.endTime && (
                  <p className="text-sm text-destructive">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location & Instructor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location & Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="required">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Room 301"
                  {...register("location")}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor" className="required">
                  Instructor
                </Label>
                <Input
                  id="instructor"
                  placeholder="e.g., Dr. Smith"
                  {...register("instructor")}
                />
                {errors.instructor && (
                  <p className="text-sm text-destructive">
                    {errors.instructor.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Class description or notes"
                  rows={3}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurring">Recurrence</Label>
                <Select value={selectedRecurring} onValueChange={setRecurring}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.recurring && (
                  <p className="text-sm text-destructive">
                    {errors.recurring.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateClassMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateClassMutation.isPending}>
              {updateClassMutation.isPending ? "Updating..." : "Update Class"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassDialog;
