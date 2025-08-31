// types/schedule.ts

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
