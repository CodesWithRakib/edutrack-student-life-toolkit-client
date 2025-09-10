// types/question.ts
// ---------------- User Summary ----------------
export interface UserSummary {
  _id: string;
  firebaseUid: string;
  name: string;
  avatar?: string | null;
  reputation: number;
  role: "student" | "teacher" | "admin";
  isTeacher?: boolean;
}

// ---------------- Answer ----------------
export interface Answer {
  _id: string;
  question: string;
  user: {
    name: string;
    avatar?: string | null;
    reputation: number;
    isTeacher: boolean;
  };
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Question ----------------
export interface Question {
  _id: string;
  user: {
    name: string;
    avatar?: string | null;
    reputation: number;
    isTeacher: boolean;
  };
  title: string;
  content: string;
  subject: string;
  tags: string[];
  votes: number;
  views: number;
  answersCount: number;
  solved: boolean;
  acceptedAnswer?: string;
  isAnonymous: boolean;
  attachments?: {
    url: string;
    type: string;
    size: number;
  }[];
  createdAt: string;
  updatedAt: string;
  answers?: Answer[];
}

// ---------------- Questions Response ----------------
export interface QuestionsResponse {
  success: boolean;
  data: {
    questions: Question[];
    totalPages: number;
    currentPage: number;
    total: number;
  };
}

// ---------------- Single Question Response ----------------
export interface QuestionResponse {
  success: boolean;
  data: Question;
}

// ---------------- Popular Tags ----------------
export interface PopularTag {
  _id: string;
  name: string;
  count: number;
  description?: string;
}

// ---------------- Question Stats ----------------
export interface QuestionStats {
  success: boolean;
  data: {
    totalQuestions: number;
    totalAnswers: number;
    solvedQuestions: number;
    totalTags: number;
    successRate: number;
  };
}

// ---------------- API Response Wrapper ----------------
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ---------------- Attachments ----------------
export interface Attachment {
  url: string;
  type: string;
  size: number;
}
