import apiClient from "@/lib/apiClient";
import type {
  Class,
  CreateClassInput,
  UpdateClassInput,
  BulkCreateClassesInput,
  ClassStats,
  WeeklyScheduleResponse,
} from "@/types/class";

export const classService = {
  // ---------------- Getters ----------------

  getClasses: async (params?: {
    day?: string;
    type?: string;
  }): Promise<Class[]> => {
    const { data } = await apiClient.get("/classes", { params });
    return data;
  },

  getClassById: async (id: string): Promise<Class> => {
    const { data } = await apiClient.get(`/classes/${id}`);
    return data;
  },

  getClassesByDay: async (day: string): Promise<Class[]> => {
    const { data } = await apiClient.get(`/classes/day/${day}`);
    return data;
  },

  getUpcomingClasses: async (limit?: number): Promise<Class[]> => {
    const { data } = await apiClient.get("/classes/upcoming", {
      params: limit ? { limit } : {},
    });
    return data;
  },

  getWeeklySchedule: async (): Promise<WeeklyScheduleResponse> => {
    const { data } = await apiClient.get("/classes/weekly");
    return data;
  },

  getStats: async (): Promise<ClassStats> => {
    const { data } = await apiClient.get("/classes/stats");
    return data;
  },

  // ---------------- Mutations ----------------

  createClass: async (cls: CreateClassInput): Promise<Class> => {
    const { data } = await apiClient.post("/classes", cls);
    return data;
  },

  bulkCreateClasses: async (
    payload: BulkCreateClassesInput
  ): Promise<Class[]> => {
    const { data } = await apiClient.post("/classes/bulk", payload);
    return data;
  },

  updateClass: async (
    id: string,
    updates: UpdateClassInput
  ): Promise<Class> => {
    const { data } = await apiClient.put(`/classes/${id}`, updates);
    return data;
  },

  updateClassColor: async (id: string, color: string): Promise<Class> => {
    const { data } = await apiClient.patch(`/classes/${id}/color`, { color });
    return data;
  },

  deleteClass: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/classes/${id}`);
    return data;
  },
};
