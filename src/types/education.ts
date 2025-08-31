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
  user: string;
  title: string;
  subject: string;
  grade?: number;
  maxGrade: number;
  date: string;
  dueDate?: string;
  submitted: boolean;
  graded: boolean;
  feedback?: string;
  priority: "low" | "medium" | "high";
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
