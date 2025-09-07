import apiClient from "@/lib/apiClient";
import type { Exam, Question } from "@/types/exam";

interface GenerateExamPayload {
  subject: string;
  difficulty: string;
  counts: {
    mcq: number;
    trueFalse: number;
    short: number;
    essay: number;
  };
}

interface SubmitExamPayload {
  answers: Record<string, string>; // questionId -> userAnswer
}

interface SubmitExamResult {
  score: number;
  total: number;
  results: {
    questionId: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export const examService = {
  // Generate new exam with AI
  generate: async (payload: GenerateExamPayload): Promise<Exam> => {
    const res = await apiClient.post("/exams/generate", payload);
    return res.data.exam;
  },

  // Get all exams
  getAll: async (): Promise<Exam[]> => {
    const res = await apiClient.get("/exams");
    return res.data;
  },

  // Get exam by id
  getById: async (id: string): Promise<Exam> => {
    const res = await apiClient.get(`/exams/${id}`);
    return res.data;
  },

  // Update exam
  update: async (id: string, data: Partial<Exam>): Promise<Exam> => {
    const res = await apiClient.put(`/exams/${id}`, data);
    return res.data.exam;
  },

  // Delete exam
  delete: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete(`/exams/${id}`);
    return res.data;
  },

  // ✅ Add questions to an existing exam
  addQuestions: async (id: string, questions: Question[]): Promise<Exam> => {
    const res = await apiClient.post(`/exams/${id}/questions`, { questions });
    return res.data.exam;
  },

  // ✅ Submit exam answers and get AI-checked results
  submit: async (
    id: string,
    payload: SubmitExamPayload
  ): Promise<SubmitExamResult> => {
    const res = await apiClient.post(`/exams/${id}/submit`, payload);
    return res.data;
  },
};
