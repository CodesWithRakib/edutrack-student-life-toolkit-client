export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "short-answer"
  | "essay";

export type DifficultyLevel = "easy" | "medium" | "hard";
// For DB-stored questions
interface BaseQuestion {
  _id: string; // always exists
  questionText: string;
  aiGenerated?: boolean;
}

// For new questions created on client (no _id yet)
interface BaseQuestionInput {
  questionText: string;
  aiGenerated?: boolean;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: string[];
  correctAnswer: string;
}
interface MultipleChoiceQuestionInput extends BaseQuestionInput {
  type: "multiple-choice";
  options: string[];
  correctAnswer: string;
}

interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  correctAnswer: "True" | "False";
}
interface TrueFalseQuestionInput extends BaseQuestionInput {
  type: "true-false";
  correctAnswer: "True" | "False";
}

interface ShortAnswerQuestion extends BaseQuestion {
  type: "short-answer";
  correctAnswer: string;
}
interface ShortAnswerQuestionInput extends BaseQuestionInput {
  type: "short-answer";
  correctAnswer: string;
}

interface EssayQuestion extends BaseQuestion {
  type: "essay";
  correctAnswer: string;
}
interface EssayQuestionInput extends BaseQuestionInput {
  type: "essay";
  correctAnswer: string;
}

// 🔹 Final discriminated unions
export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | ShortAnswerQuestion
  | EssayQuestion;

export type QuestionInput =
  | MultipleChoiceQuestionInput
  | TrueFalseQuestionInput
  | ShortAnswerQuestionInput
  | EssayQuestionInput;

export type DifficultyType = "easy" | "medium" | "hard";

export interface Exam {
  _id: string;
  title: string;
  subject: string;
  difficulty: DifficultyLevel;
  questions: Question[];
  createdBy: string;
  createdAt: Date;
}

export interface QuestionResult {
  questionId: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  feedback: string;
}

export interface GenerateExamRequest {
  subject: string;
  difficulty: DifficultyLevel;
  counts: {
    mcq: number;
    trueFalse: number;
    short: number;
    essay: number;
  };
}
export interface ExamResult {
  score: number;
  total: number;
  results: QuestionResult[];
}
