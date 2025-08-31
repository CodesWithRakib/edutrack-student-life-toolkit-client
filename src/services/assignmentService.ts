// src/services/assignmentService.ts
import apiClient from "@/lib/apiClient";
import type { Assignment } from "@/types/education";

export const assignmentService = {
  // ---------------- Assignments ----------------
  getAssignments: async (): Promise<Assignment[]> => {
    const { data } = await apiClient.get("/assignments");
    return data;
  },

  createAssignment: async (
    assignment: Omit<Assignment, "_id">
  ): Promise<Assignment> => {
    const { data } = await apiClient.post("/assignments", assignment);
    return data;
  },

  updateAssignment: async (
    id: string,
    updates: Partial<Assignment>
  ): Promise<Assignment> => {
    const { data } = await apiClient.put(`/assignments/${id}`, updates);
    return data;
  },

  toggleAssignmentCompletion: async (id: string): Promise<Assignment> => {
    const { data } = await apiClient.patch(`/assignments/${id}/toggle`);
    return data;
  },

  deleteAssignment: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/assignments/${id}`);
    return data;
  },
};
