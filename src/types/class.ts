// src/types/class.ts
export interface Class {
  _id: string;
  user: string;
  title: string;
  startTime: string;
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
  recurring?: "none" | "daily" | "weekly";
  createdAt?: string;
  updatedAt?: string;
}
