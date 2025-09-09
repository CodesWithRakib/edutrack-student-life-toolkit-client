// src/hooks/useStudySessions.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studySessionService } from "@/services/studySessionService";
import type {
  StudySession,
  UpdateStudySessionPayload,
  StudySessionFilters,
  CreateStudySessionPayload,
  DeleteStudySessionResponse,
} from "@/types/education";

// Query Keys (to keep cache consistent)
const queryKeys = {
  all: ["studySessions"] as const,
  list: (filters?: StudySessionFilters) =>
    [...queryKeys.all, { filters }] as const,
  detail: (id: string) => [...queryKeys.all, id] as const,
};

// 🔹 Get all study sessions with filters
export function useStudySessions(filters?: StudySessionFilters) {
  return useQuery<StudySession[]>({
    queryKey: queryKeys.list(filters),
    queryFn: () => studySessionService.getStudySessions(filters),
  });
}

// 🔹 Create a new study session
export function useCreateStudySession() {
  const queryClient = useQueryClient();

  return useMutation<StudySession, Error, CreateStudySessionPayload>({
    mutationFn: studySessionService.createStudySession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

// 🔹 Update an existing study session
export function useUpdateStudySession() {
  const queryClient = useQueryClient();

  return useMutation<
    StudySession, // server returns StudySession
    Error,
    { id: string; updates: UpdateStudySessionPayload }
  >({
    mutationFn: ({ id, updates }) =>
      studySessionService.updateStudySession(id, updates),
    onSuccess: (updatedSession) => {
      if (!updatedSession || !updatedSession._id) return; // safety check

      // Update cache for list & detail
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      queryClient.setQueryData(
        queryKeys.detail(updatedSession._id),
        updatedSession
      );
    },
  });
}

// 🔹 Toggle completion status
export function useToggleStudySession() {
  const queryClient = useQueryClient();

  return useMutation<StudySession, Error, string>({
    mutationFn: (id: string) =>
      studySessionService.toggleStudySessionCompletion(id),
    onSuccess: (updatedSession) => {
      if (!updatedSession || !updatedSession._id) return; // safety check

      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      queryClient.setQueryData(
        queryKeys.detail(updatedSession._id),
        updatedSession
      );
    },
  });
}

// 🔹 Delete a study session
export function useDeleteStudySession() {
  const queryClient = useQueryClient();

  return useMutation<DeleteStudySessionResponse, Error, string>({
    mutationFn: studySessionService.deleteStudySession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}
