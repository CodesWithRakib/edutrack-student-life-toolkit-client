// src/services/assignmentService.ts
import apiClient from "@/lib/apiClient";
import type { Assignment } from "@/types/education";

// Define interface for query parameters
export interface AssignmentFilters {
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  graded?: boolean;
  subject?: string;
}

// Define interface for creating assignments with only the required fields
export interface CreateAssignmentData {
  title: string;
  subject: string;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  description?: string;
  grade?: number;
  maxGrade?: number;
  durationMinutes?: number;
}

export const assignmentService = {
  // Updated to support query parameters for filtering
  getAssignments: async (
    filters?: AssignmentFilters
  ): Promise<Assignment[]> => {
    // Convert filters object to query string
    const params = new URLSearchParams();
    if (filters !== undefined) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/assignments?${queryString}` : "/assignments";

    const { data } = await apiClient.get(url);
    return data;
  },

  createAssignment: async (
    assignment: CreateAssignmentData
  ): Promise<Assignment> => {
    const { data } = await apiClient.post("/assignments", assignment);
    return data;
  },

  updateAssignment: async (
    id: string,
    updates: Partial<Omit<Assignment, "_id" | "createdAt" | "updatedAt">>
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
