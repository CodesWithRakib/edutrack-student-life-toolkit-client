import apiClient from "@/lib/apiClient";
import type {
  Assignment,
  AssignmentFilters,
  CreateAssignmentData,
  UpdateAssignmentPayload,
} from "@/types/education";

// Payload for updating assignments

export const assignmentService = {
  getAssignments: async (
    filters?: AssignmentFilters
  ): Promise<Assignment[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    const queryString = params.toString();
    const url = queryString ? `/assignments?${queryString}` : "/assignments";
    const { data } = await apiClient.get<Assignment[]>(url);
    return data;
  },

  createAssignment: async (
    assignment: CreateAssignmentData
  ): Promise<Assignment> => {
    const { data } = await apiClient.post<Assignment>(
      "/assignments",
      assignment
    );
    return data;
  },

  updateAssignment: async (
    id: string,
    updates: UpdateAssignmentPayload
  ): Promise<Assignment> => {
    const { data } = await apiClient.put<Assignment>(
      `/assignments/${id}`,
      updates
    );
    return data;
  },

  toggleAssignmentCompletion: async (id: string): Promise<Assignment> => {
    const { data } = await apiClient.patch<Assignment>(
      `/assignments/${id}/toggle`
    );
    return data;
  },

  deleteAssignment: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/assignments/${id}`
    );
    return data;
  },
};
