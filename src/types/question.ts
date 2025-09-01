export interface Question {
  _id: string;
  user: string; // User ID
  title: string;
  content: string;
  subject: string;
  tags: string[];
  votes: number;
  views: number;
  answersCount: number;
  solved: boolean;
  acceptedAnswer?: string; // Answer ID
  attachments?: Array<{
    url: string;
    type: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionsResponse {
  questions: Question[];
  totalPages: number;
  currentPage: number;
  total: number;
}
export interface QuestionStats {
  totalQuestions: number;
  totalAnswers: number;
  solvedQuestions: number;
  totalTags: number;
  successRate: number;
}

export interface PopularTag {
  _id: string;
  name: string;
  count: number;
  description?: string;
}
