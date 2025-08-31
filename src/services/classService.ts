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

  getWeeklySchedule: async (): Promise<Class[]> => {
    const { data } = await apiClient.get("/classes/weekly");
    return data;
  },

  createClass: async (cls: Omit<Class, "_id">): Promise<Class> => {
    const { data } = await apiClient.post("/classes", cls);
    return data;
  },

  updateClass: async (id: string, updates: Partial<Class>): Promise<Class> => {
    const { data } = await apiClient.put(`/classes/${id}`, updates);
    return data;
  },

  deleteClass: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/classes/${id}`);
    return data;
  },
};
