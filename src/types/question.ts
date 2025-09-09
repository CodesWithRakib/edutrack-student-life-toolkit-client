export interface QuestionsResponse {
  questions: Question[];
  totalPages: number;
  currentPage: number;
  total: number;
}
// ---------------- Attachments ----------------
export interface Attachment {
  url: string;
  type: string;
  size: number;
}

// ---------------- Question ----------------
export interface Question {
  _id: string;
  user: {
    uid?: string; // for Firebase UID
    name?: string;
    avatar?: string;
  };
  title: string;
  content: string;
  subject: string;
  tags: string[];
  votes: number;
  views: number;
  answersCount: number;
  solved: boolean;
  acceptedAnswer?: string | null; // Answer ID
  attachments?: Attachment[];
  createdAt: string; // ISO date string from backend
  updatedAt: string; // ISO date string
}

// ---------------- Popular Tags ----------------
export interface PopularTag {
  _id: string;
  name: string;
  count: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Question Stats ----------------
export interface QuestionStats {
  totalQuestions: number;
  totalAnswers: number;
  solvedQuestions: number;
  totalTags: number;
  successRate: number; // percentage
}
