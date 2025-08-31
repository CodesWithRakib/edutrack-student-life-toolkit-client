export interface Question {
  _id: string;
  user: string; // User ID or a User type
  title: string;
  content: string;
  subject: string;
  tags: string[];
  votes: number;
  views: number;
  answersCount: number;
  solved: boolean;
  acceptedAnswer?: string; // Answer _id
  createdAt: string;
  updatedAt: string;
}

export interface QuestionStats {
  totalQuestions: number;
  totalAnswers: number;
  solvedQuestions: number;
  successRate: number;
}
