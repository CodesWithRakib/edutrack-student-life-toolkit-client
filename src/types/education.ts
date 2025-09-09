// types/education.ts
export interface Grade {
  _id?: string;
  user: string;
  subject: string;
  grade: number;
  maxGrade?: number; // default 100
  trend?: "up" | "down" | "stable"; // default "stable"
  date?: string; // ISO string from backend Date
  term: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyGoal {
  _id: string;
  user: string; // Firebase UID
  subject: string;
  targetHours: number;
  completedHours: number;
  period: "daily" | "weekly" | "monthly";
  startDate: string; // ISO string
  endDate?: string;
  achieved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudyGoalFilters {
  period?: "daily" | "weekly" | "monthly";
}

export interface CreateStudyGoalData {
  subject: string;
  targetHours: number;
  period?: "daily" | "weekly" | "monthly";
  startDate?: Date | string;
  endDate?: Date | string;
}

export type UpdateStudyGoalPayload = Partial<
  Omit<
    StudyGoal,
    "_id" | "createdAt" | "updatedAt" | "completedHours" | "achieved" | "user"
  >
>;

export interface StudySessionFilters {
  period?: "today" | "week" | "month";
  completed?: boolean;
}

export type StudySessionPriority = "high" | "medium" | "low";

export interface StudySession {
  _id?: string;
  user: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  date: string; // ISO string
  time: string; // HH:mm
  completed?: boolean;
  priority?: StudySessionPriority;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Optional payloads for create/update
export interface CreateStudySessionPayload {
  subject: string;
  topic: string;
  durationMinutes: number;
  date: string;
  time: string;
  priority?: StudySessionPriority;
  notes?: string;
}

export interface UpdateStudySessionPayload {
  subject?: string;
  topic?: string;
  durationMinutes?: number;
  date?: string | Date;
  time?: string;
  completed?: boolean;
  priority?: "high" | "medium" | "low";
  notes?: string;
}

export interface DeleteStudySessionResponse {
  message: string;
}

export interface Assignment {
  _id: string;
  user: string; // Firebase UID
  title: string;
  subject: string;
  grade?: number;
  maxGrade: number;
  date: string; // ISO string for created date
  dueDate?: string;
  submitted?: boolean;
  graded?: boolean;
  feedback?: string;
  priority: "low" | "medium" | "high";
  description?: string;
  completed: boolean;
  achieved: boolean;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

// Filters for fetching assignments
export interface AssignmentFilters {
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  graded?: boolean;
  subject?: string;
}

// Payload for creating assignments
export interface CreateAssignmentData {
  title: string;
  subject: string;
  dueDate?: Date | string;
  priority?: "low" | "medium" | "high";
  description?: string;
  grade?: number;
  maxGrade?: number;
  durationMinutes?: number;
}

// Payload for updating an assignment
export type UpdateAssignmentPayload = Partial<{
  title: string;
  subject: string;
  grade: number;
  maxGrade: number;
  dueDate: string | Date;
  submitted: boolean;
  graded: boolean;
  feedback: string;
  priority: "low" | "medium" | "high";
  description: string;
  completed: boolean;
  achieved: boolean;
  durationMinutes: number;
}>;
