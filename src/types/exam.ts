export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "short-answer"
  | "essay";

export interface Question {
  type: QuestionType;
  questionText: string;
  options?: string[]; // only for multiple-choice
  correctAnswer?: string | string[];
  aiGenerated: boolean;
  _id: string;
}

export type DifficultyType = "easy" | "medium" | "hard";

export interface Exam {
  _id: string;
  title: string;
  subject: string;
  questions: Question[];
  difficulty: DifficultyType;
  createdBy: string;
  createdAt: string;
}
