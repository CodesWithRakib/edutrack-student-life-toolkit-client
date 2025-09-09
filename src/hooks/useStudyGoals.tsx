import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studyGoalService } from "@/services/studyGoalService";
import type {
  StudyGoal,
  CreateStudyGoalData,
  StudyGoalFilters,
  UpdateStudyGoalPayload,
} from "@/types/education";

// Query keys
const queryKeys = {
  all: ["studyGoals"] as const,
  list: (filters?: StudyGoalFilters) =>
    [...queryKeys.all, { filters }] as const,
  detail: (id: string) => [...queryKeys.all, id] as const,
};

// Fetch all study goals with optional filters
export function useStudyGoals(filters?: StudyGoalFilters) {
  return useQuery<StudyGoal[]>({
    queryKey: queryKeys.list(filters),
    queryFn: () => studyGoalService.getStudyGoals(filters),
  });
}

// Create new goal
export function useCreateStudyGoal() {
  const queryClient = useQueryClient();

  return useMutation<StudyGoal, Error, CreateStudyGoalData>({
    mutationFn: studyGoalService.createStudyGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

// Update goal
export function useUpdateStudyGoal() {
  const queryClient = useQueryClient();

  return useMutation<
    StudyGoal,
    Error,
    { id: string; updates: UpdateStudyGoalPayload }
  >({
    mutationFn: ({ id, updates }) =>
      studyGoalService.updateStudyGoal(id, updates),
    onSuccess: (updatedGoal) => {
      if (!updatedGoal?._id) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      queryClient.setQueryData(queryKeys.detail(updatedGoal._id), updatedGoal);
    },
  });
}

// Delete goal
export function useDeleteStudyGoal() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => studyGoalService.deleteStudyGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}
