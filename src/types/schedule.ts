// types/schedule.ts

export interface Class {
  _id?: string;
  user: string;
  title: string;
  time: string;
  location: string;
  instructor: string;
  type: "lecture" | "lab" | "tutorial" | "discussion";
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  color?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  recurring?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavingsGoal {
  _id?: string;
  user: string;
  target: number;
  current?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// src/types/schedule.ts

export interface Schedule {
  _id?: string;
  title: string;
  description?: string;
  date: string; // ISO string
  time: string; // e.g., "10:00 AM - 11:30 AM"
  teacher?: string; // firebase UID of teacher
  students?: string[]; // array of firebase UIDs
  createdBy: string; // firebase UID of creator
  createdAt?: string;
  updatedAt?: string;
}
