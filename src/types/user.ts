export interface User {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  avatar: string;
  role: "student" | "teacher" | "admin";
  createdAt?: string;
  updatedAt?: string;
}
