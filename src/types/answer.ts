// src/types/answer.ts
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

export interface GetAnswersResponse {
  success: boolean;
  data: {
    answers: Answer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
