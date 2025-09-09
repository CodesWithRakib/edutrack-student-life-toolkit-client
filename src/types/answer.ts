export type Answer = {
  _id: string;
  question: string;
  user: string;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetAnswersResponse = {
  answers: Answer[];
  total: number;
  page: number;
  limit: number;
};
