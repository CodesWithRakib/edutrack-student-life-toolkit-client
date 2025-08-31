// src/types/class.ts
export interface Class {
  _id: string;
  user: string;
  title: string;
  startTime: string; // Replaced generic "time" with specific start/end times
  endTime: string;
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
  color: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  recurring?: boolean;
  durationMinutes?: number;
  createdAt?: string;
  updatedAt?: string;
}
