import apiClient from "@/lib/apiClient";
import type { Grade } from "@/types/education";
import type {
  PerformanceOverview,
  StudyAnalytics,
  StudyRecommendation,
} from "@/types/performance";

export const performanceService = {
  // ---------------- Grades ----------------
  getGrades: async (): Promise<Grade[]> => {
    const { data } = await apiClient.get("/performance/grades");
    return data;
  },

  // ---------------- Performance Overview ----------------
  getPerformanceOverview: async (): Promise<PerformanceOverview> => {
    const { data } = await apiClient.get("/performance/overview");
    return data;
  },

  getStudyAnalytics: async (): Promise<StudyAnalytics> => {
    const { data } = await apiClient.get("/performance/analytics");
    return data;
  },

  getStudyRecommendations: async (): Promise<StudyRecommendation> => {
    const { data } = await apiClient.get("/performance/recommendations");
    return data;
  },
};
