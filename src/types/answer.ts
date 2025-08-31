export interface Answer {
  _id: string;
  question: string;
  user: string;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnswersResponse {
  answers: Answer[];
  total: number;
  page: number;
  limit: number;
}
