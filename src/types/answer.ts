export interface Answer {
  _id: string;
  question: string; // Question _id
  user: string; // User _id
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnswersResponse {
  answers: Answer[];
  total: number;
}
