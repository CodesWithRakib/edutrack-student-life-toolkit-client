// src/types/savings.ts

export interface SavingsGoal {
  _id?: string;
  user: string;
  target: number;
  current?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
