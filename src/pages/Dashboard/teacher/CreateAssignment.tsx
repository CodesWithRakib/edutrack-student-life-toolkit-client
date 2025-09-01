// src/Dashboard/teacher/CreateAssignment.tsx
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Assignment } from "@/types/education";
import apiClient from "@/lib/apiClient";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.string().min(1, "Please select a subject"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().optional(),
});

type FormValues = {
  title: string;
  subject: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  description?: string;
};

const CreateAssignment = () => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "",
      dueDate: "",
      priority: "medium",
      description: "",
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (assignmentData: FormValues) => {
      // Assuming you have an API client function like this
      const response = await apiClient.post("/assignments", assignmentData);
      return response.data as Assignment;
    },
    onSuccess: (data: Assignment) => {
      console.log(data);
      toast.success("Assignment created successfully.");
      navigate("/dashboard/teacher/assignments");
    },
    onError: (error: Error) => {
      toast.error("Failed to create assignment. Please try again.");
      console.error("Assignment creation error:", error);
    },
  });

  const onSubmit = async (data: FormValues) => {
    createAssignmentMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Assignment</h1>
        <p className="text-muted-foreground">
          Fill out the details for your new assignment
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="block text-sm font-medium mb-2">
              Assignment Title *
            </Label>
            <Input
              id="title"
              {...form.register("title")}
              className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter assignment title..."
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject *
            </Label>
            <Controller
              name="subject"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.subject && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="dueDate" className="block text-sm font-medium mb-2">
              Due Date *
            </Label>
            <Input
              id="dueDate"
              type="date"
              {...form.register("dueDate")}
              className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {form.formState.errors.dueDate && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.dueDate.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="priority"
              className="block text-sm font-medium mb-2"
            >
              Priority Level
            </Label>
            <Select
              value={form.watch("priority")}
              onValueChange={(value: "low" | "medium" | "high") =>
                form.setValue("priority", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              placeholder="Add assignment instructions or notes..."
            />
          </div>

          <Button
            type="submit"
            disabled={createAssignmentMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {createAssignmentMutation.isPending
              ? "Creating..."
              : "Create Assignment"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;
