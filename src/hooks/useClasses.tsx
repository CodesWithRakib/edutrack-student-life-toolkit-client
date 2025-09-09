// src/hooks/useClasses.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { classService } from "@/services/classService";
import type {
  Class,
  ClassStats,
  CreateClassInput,
  WeeklyScheduleResponse,
} from "@/types/class";

// ----------------- Queries -----------------
export const useClasses = (
  params?: { day?: string; type?: string },
  options?: UseQueryOptions<Class[], Error>
) => {
  return useQuery<Class[], Error>({
    queryKey: ["classes", params],
    queryFn: () => classService.getClasses(params),
    ...options,
  });
};

export const useClassesByDay = (
  day: string,
  options?: UseQueryOptions<Class[], Error>
) => {
  return useQuery<Class[], Error>({
    queryKey: ["classes", day],
    queryFn: () => classService.getClassesByDay(day),
    enabled: !!day,
    ...options,
  });
};

export const useUpcomingClasses = (
  limit?: number,
  options?: UseQueryOptions<Class[], Error>
) => {
  return useQuery<Class[], Error>({
    queryKey: ["upcoming-classes", limit],
    queryFn: () => classService.getUpcomingClasses(limit),
    ...options,
  });
};

export const useWeeklySchedule = (
  options?: UseQueryOptions<WeeklyScheduleResponse, Error>
) => {
  return useQuery<WeeklyScheduleResponse, Error>({
    queryKey: ["weekly-schedule"],
    queryFn: classService.getWeeklySchedule,
    ...options,
  });
};

export const useClassStats = (options?: UseQueryOptions<ClassStats, Error>) => {
  return useQuery<ClassStats, Error>({
    queryKey: ["classes-stats"],
    queryFn: classService.getStats,
    ...options,
  });
};

// ----------------- Mutations -----------------
export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes-stats"] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Class> }) =>
      classService.updateClass(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["classes-stats"] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classService.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes-stats"] });
    },
  });
};

export const useUpdateClassColor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, color }: { id: string; color: string }) =>
      classService.updateClassColor(id, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useBulkCreateClasses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classes: CreateClassInput[]) =>
      classService.bulkCreateClasses({ classes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["classes-stats"] });
    },
  });
};
