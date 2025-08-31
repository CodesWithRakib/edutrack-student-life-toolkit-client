import type { Grade, StudyGoal } from "./education";

// Response for /api/performance/overview
export interface PerformanceOverview {
  overallAverage: number; // e.g., 85.2
  weeklyHours: number; // total hours studied this week
  completedAssignments: string; // e.g., "3/5"
  completionRate: number; // e.g., 60 (%)
  achievedGoals: string; // e.g., "2/4"
  goalsProgress: number; // e.g., 50 (%)
}

// Response for /api/performance/grades
export interface GradesData {
  grades: Grade[];
  gradeHistory: {
    name: string; // assignment title
    grade: number;
    date: string; // YYYY-MM-DD
  }[];
}

// For /api/performance/analytics
export interface StudyAnalytics {
  weeklyProgressData: {
    day: string; // "Sun", "Mon", etc.
    hours: number;
  }[];
  subjectDistributionData: {
    name: string; // subject
    value: number; // percentage of total hours
  }[];
  goals: StudyGoal[];
}

// For /api/performance/recommendations
export interface StudyRecommendation {
  type: "focus" | "consistency" | "upcoming" | "goal";
  title: string;
  description: string;
  icon: "Award" | "Clock" | "Calendar" | "Target";
}
