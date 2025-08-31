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
