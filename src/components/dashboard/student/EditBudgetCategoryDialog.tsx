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
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-0 shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Edit Budget Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          {/* Category Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category"
              placeholder="e.g., Food, Transport"
              className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              {...register("category")}
            />
            {errors.category && (
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
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Budget Amount Field */}
          <div className="space-y-2">
            <Label
              htmlFor="budget"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Budget Amount <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                  $
                </span>
              </div>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                className="pl-8 shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                {...register("budget", { valueAsNumber: true })}
              />
            </div>
            {errors.budget && (
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
                {errors.budget.message}
              </p>
            )}
          </div>

          {/* Color Selection Field */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Color <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <div
                  key={color.value}
                  className="flex flex-col items-center gap-1"
                >
                  <button
                    type="button"
                    className={`h-10 w-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      selectedColor === color.value
                        ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/30"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setValue("color", color.value)}
                    aria-label={`Select ${color.name} color`}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
            {errors.color && (
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
                {errors.color.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            disabled={updateBudgetCategoryMutation.isPending}
          >
            {updateBudgetCategoryMutation.isPending ? (
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
                Updating...
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Update Budget Category
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetCategoryDialog;
