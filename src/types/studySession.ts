// src/types/studySession.ts

// Priority levels
export type StudySessionPriority = "high" | "medium" | "low";

// Full study session type returned by backend
export interface StudySession {
  _id: string;
  user: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  date: string; // ISO string
  time: string; // "HH:mm"
  completed: boolean;
  priority: StudySessionPriority;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Filters used when fetching study sessions
export interface StudySessionFilters {
  period?: "today" | "week" | "month";
  completed?: boolean;
}

// Payload when creating a new study session
export interface CreateStudySessionPayload {
  subject: string;
  topic: string;
  durationMinutes: number;
  date: string | Date; // ISO string or Date object
  time: string; // "HH:mm"
  priority?: StudySessionPriority; // default "medium"
  notes?: string;
}

// Payload when updating a study session
// Exclude fields that backend sets automatically (_id, user, createdAt, updatedAt)
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

// Response when deleting a study session
export interface DeleteStudySessionResponse {
  message: string;
}
