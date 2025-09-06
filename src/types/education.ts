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
  _id?: string;
  user: string;
  subject: string;
  targetHours: number;
  completedHours?: number; // default 0
  period?: "daily" | "weekly" | "monthly"; // default "weekly"
  startDate?: string; // ISO string from backend Date
  endDate?: string; // ISO string
  achieved?: boolean; // default false
  createdAt?: string;
  updatedAt?: string;
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

export interface UpdateStudySessionPayload
  extends Partial<CreateStudySessionPayload> {
  completed?: boolean;
}

export interface Assignment {
  _id?: string;
  user: string;
  title: string;
  subject: string;
  grade?: number; // optional if not graded yet
  maxGrade?: number; // default 100
  date: string; // ISO string
  dueDate?: string; // optional
  submitted?: boolean; // default false
  graded?: boolean; // default false
  achieved?: boolean; // whether grade >= threshold
  feedback?: string;
  priority?: "low" | "medium" | "high"; // default "medium"
  description?: string;
  completed?: boolean; // default false
  durationMinutes?: number; // optional, time spent
  createdAt?: string;
  updatedAt?: string;
}
