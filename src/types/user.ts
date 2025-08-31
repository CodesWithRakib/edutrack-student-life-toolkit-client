// src/types/user.ts
export type UserRole = "student" | "teacher" | "admin";
export type UserStatus = "active" | "inactive" | "suspended";

export interface UsersResponse {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export interface User {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  avatar: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserRolePayload {
  id: string;
  role: UserRole;
}

export interface UpdateUserStatusPayload {
  id: string;
  status: UserStatus;
}
