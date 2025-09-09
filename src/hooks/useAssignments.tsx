"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentService } from "@/services/assignmentService";
import type {
  Assignment,
  CreateAssignmentData,
  UpdateAssignmentPayload,
  AssignmentFilters,
} from "@/types/education";

// Query keys
const queryKeys = {
  all: ["assignments"] as const,
  list: (filters?: AssignmentFilters) =>
    [...queryKeys.all, { filters }] as const,
  detail: (id: string) => [...queryKeys.all, id] as const,
};

// Fetch assignments with filters
export function useAssignments(filters?: AssignmentFilters) {
  return useQuery<Assignment[]>({
    queryKey: queryKeys.list(filters),
    queryFn: () => assignmentService.getAssignments(filters),
  });
}

// Create assignment
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation<Assignment, Error, CreateAssignmentData>({
    mutationFn: assignmentService.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

// Update assignment
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation<
    Assignment,
    Error,
    { id: string; updates: UpdateAssignmentPayload }
  >({
    mutationFn: ({ id, updates }) =>
      assignmentService.updateAssignment(id, updates),
    onSuccess: (updatedAssignment) => {
      if (!updatedAssignment?._id) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      queryClient.setQueryData(
        queryKeys.detail(updatedAssignment._id),
        updatedAssignment
      );
    },
  });
}

// Toggle completion
export function useToggleAssignment() {
  const queryClient = useQueryClient();

  return useMutation<Assignment, Error, string>({
    mutationFn: (id) => assignmentService.toggleAssignmentCompletion(id),
    onSuccess: (updatedAssignment) => {
      if (!updatedAssignment?._id) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      queryClient.setQueryData(
        queryKeys.detail(updatedAssignment._id),
        updatedAssignment
      );
    },
  });
}

// Delete assignment
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => assignmentService.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}
