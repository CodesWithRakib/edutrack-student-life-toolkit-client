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
import { budgetService } from "@/services/budgetService";
import { toast } from "sonner";
import type { BudgetCategory } from "@/types/budget";

const formSchema = z.object({
  category: z.string().min(1, "Category name is required"),
  budget: z.coerce.number().positive("Budget must be positive"),
  color: z.string().min(1, "Color is required"),
});

interface EditBudgetCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetCategory: BudgetCategory;
}

const EditBudgetCategoryDialog: React.FC<EditBudgetCategoryDialogProps> = ({
  open,
  onOpenChange,
  budgetCategory,
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
      category: budgetCategory.category,
      budget: budgetCategory.budget,
      color: budgetCategory.color,
    },
  });

  const updateBudgetCategoryMutation = useMutation({
    mutationFn: (updates: Partial<BudgetCategory>) =>
      budgetService.updateBudgetCategory(budgetCategory._id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-categories"] });
      toast.success("Budget category updated successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update budget category");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateBudgetCategoryMutation.mutate(values);
  };

  const colorOptions = [
    { value: "#3b82f6", name: "Blue" },
    { value: "#ef4444", name: "Red" },
    { value: "#10b981", name: "Green" },
    { value: "#f59e0b", name: "Amber" },
    { value: "#8b5cf6", name: "Purple" },
    { value: "#6b7280", name: "Gray" },
  ];

  const selectedColor = watch("color");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Budget Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category Name Field */}
          <div className="space-y-2">
            <Label htmlFor="category">Category Name</Label>
            <Input
              id="category"
              placeholder="e.g., Food, Transport"
              {...register("category")}
            />
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Budget Amount Field */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget Amount</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              {...register("budget", { valueAsNumber: true })}
            />
            {errors.budget && (
              <p className="text-sm text-destructive">
                {errors.budget.message}
              </p>
            )}
          </div>

          {/* Color Selection Field */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`h-8 w-8 rounded-full border-2 ${
                    selectedColor === color.value
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setValue("color", color.value)}
                />
              ))}
            </div>
            {errors.color && (
              <p className="text-sm text-destructive">{errors.color.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={updateBudgetCategoryMutation.isPending}
          >
            {updateBudgetCategoryMutation.isPending
              ? "Updating..."
              : "Update Budget Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetCategoryDialog;
