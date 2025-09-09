// src/types/class.ts
export type ClassType = "lecture" | "lab" | "tutorial" | "discussion";
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export type RecurringType = "none" | "daily" | "weekly";

export interface Class {
  _id: string;
  user: string;
  title: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  location: string;
  instructor: string;
  type: ClassType;
  day: DayOfWeek;
  color: string; // Added color field
  description?: string;
  recurring: RecurringType;
  createdAt: string;
  updatedAt: string;
}

// For creating a class (no _id, user, timestamps yet)
export interface CreateClassInput {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  instructor: string;
  type: ClassType;
  day: DayOfWeek;
  description?: string;
  recurring?: RecurringType;
  color?: string; // Added color field
}

// For updating a class (partial updates allowed)
export interface UpdateClassInput extends Partial<CreateClassInput> {
  color?: string; // Already included but explicitly listed
}

// Bulk create input
export interface BulkCreateClassesInput {
  classes: CreateClassInput[];
}

// Class stats response with additional fields
export interface ClassStats {
  busiestDay: DayOfWeek | null;
  totalHours: string; // Backend returns string
  classCount: number;
  classesByType: Record<ClassType, number>; // Added
  classesByDay: Record<DayOfWeek, number>; // Added
}

// Weekly schedule type
export type WeeklySchedule = {
  [D in DayOfWeek]: Class[];
};

// Enhanced weekly schedule response with week dates
export interface WeeklyScheduleResponse {
  weeklySchedule: WeeklySchedule;
  weekDates: {
    start: string;
    end: string;
  };
}
