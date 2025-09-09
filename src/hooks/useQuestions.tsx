// src/hooks/useQuestions.ts
"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { questionService } from "@/services/questionService";
import type { Question } from "@/types/question";

type GetQuestionsParams = {
  subject?: string;
  tags?: string[];
  search?: string;
  sort?: "newest" | "most-voted" | "most-viewed";
  page?: number;
  limit?: number;
};

type GetQuestionsResponse = {
  questions: Question[];
  totalPages: number;
  currentPage: number;
  total: number;
};

// ----------------- Queries -----------------

// Fetch list of questions with filters
export const useQuestions = (params: GetQuestionsParams = {}) => {
  return useQuery<GetQuestionsResponse, Error>({
    queryKey: ["questions", params],
    queryFn: () => questionService.getQuestions(params),
    placeholderData: keepPreviousData,
  });
};

// Fetch single question by ID
export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => questionService.getQuestionById(id),
    enabled: !!id, // only fetch if id exists
  });
};

// Fetch popular tags
export const usePopularTags = () => {
  return useQuery({
    queryKey: ["popular-tags"],
    queryFn: questionService.getPopularTags,
  });
};

// Fetch question stats
export const useQuestionStats = () => {
  return useQuery({
    queryKey: ["question-stats"],
    queryFn: questionService.getStats,
  });
};

// ----------------- Mutations -----------------

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionService.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Question> }) =>
      questionService.updateQuestion(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", variables.id] });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionService.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

export const useVoteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: "up" | "down" }) =>
      questionService.voteQuestion(id, type),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", variables.id] });
    },
  });
};
