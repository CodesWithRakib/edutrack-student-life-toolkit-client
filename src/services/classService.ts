import apiClient from "@/lib/apiClient";
import type { Class } from "@/types/class";

export const classService = {
  // ---------------- Classes ----------------
  getClasses: async (): Promise<Class[]> => {
    const { data } = await apiClient.get("/classes");
    return data;
  },

  getClassesByDay: async (day: string): Promise<Class[]> => {
    const { data } = await apiClient.get(`/classes/day/${day}`);
    return data;
  },

  getUpcomingClasses: async (): Promise<Class[]> => {
    const { data } = await apiClient.get("/classes/upcoming");
    return data;
  },

  getWeeklySchedule: async (): Promise<Record<string, Class[]>> => {
    const { data } = await apiClient.get("/classes/weekly");
    return data;
  },

  createClass: async (cls: {
    title: string;
    startTime: string;
    endTime: string;
    location: string;
    instructor: string;
    type: "lecture" | "lab" | "tutorial" | "discussion";
    day: string;
    durationMinutes?: number; // Optional with default
    description?: string;
    startDate?: string;
    endDate?: string;
    recurring?: boolean;
  }): Promise<Class> => {
    const { data } = await apiClient.post("/classes", cls);
    return data;
  },

  updateClass: async (
    id: string,
    updates: Partial<{
      title?: string;
      startTime?: string;
      endTime?: string;
      location?: string;
      instructor?: string;
      type?: "lecture" | "lab" | "tutorial" | "discussion";
      day?: string;
      durationMinutes?: number;
      description?: string;
      startDate?: string;
      endDate?: string;
      recurring?: boolean;
    }>
  ): Promise<Class> => {
    const { data } = await apiClient.put(`/classes/${id}`, updates);
    return data;
  },

  deleteClass: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/classes/${id}`);
    return data;
  },
};
