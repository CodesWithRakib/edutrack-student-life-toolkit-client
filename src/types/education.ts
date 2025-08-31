// types/education.ts

export interface Grade {
  _id?: string;
  user: string;
  subject: string;
  grade: number;
  maxGrade?: number;
  trend?: "up" | "down" | "stable";
  date?: string;
  term: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyGoal {
  _id?: string;
  user: string;
  subject: string;
  targetHours: number;
  completedHours?: number;
  period?: "daily" | "weekly" | "monthly";
  startDate?: string;
  endDate?: string;
  achieved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudySession {
  _id?: string;
  user: string;
  subject: string;
  topic: string;
  duration: string;
  date: string;
  time: string;
  completed?: boolean;
  priority?: "high" | "medium" | "low";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Assignment {
  _id: string;
  user: string; // UserId (MongoDB ObjectId)
  title: string;
  subject: string;
  grade?: number;
  maxGrade?: number;
  date: string; // ISO string
  dueDate?: string; // ISO string
  submitted: boolean;
  graded: boolean;
  feedback?: string;

  // Optional fields mentioned in controller
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  description?: string;

  createdAt: string;
  updatedAt: string;
}

export interface AssignmentsResponse {
  assignments: Assignment[];
  total?: number; // useful if we later add pagination
}
