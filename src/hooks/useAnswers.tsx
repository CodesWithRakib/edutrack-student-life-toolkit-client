"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { answerService } from "@/services/answerService";
import type { Answer, GetAnswersResponse } from "@/types/answer";

// ----------------- Queries -----------------

export const useAnswersByQuestion = (
  questionId: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useQuery<GetAnswersResponse, Error>({
    queryKey: ["answers", questionId, params],
    queryFn: () => answerService.getAnswersByQuestion(questionId, params),
    placeholderData: keepPreviousData, // ✅ fixed overload issue
    enabled: !!questionId,
  });
};

// ----------------- Mutations -----------------

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: answerService.createAnswer,
    onSuccess: (newAnswer) => {
      // ✅ no need to pass questionId manually
      queryClient.invalidateQueries({
        queryKey: ["answers", newAnswer.question],
      });
    },
  });
};

export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Answer> }) =>
      answerService.updateAnswer(id, updates),
    onSuccess: (updatedAnswer) => {
      queryClient.invalidateQueries({
        queryKey: ["answers", updatedAnswer.question],
      });
      queryClient.invalidateQueries({
        queryKey: ["answer", updatedAnswer._id],
      });
    },
  });
};

export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: answerService.deleteAnswer,
    onSuccess: (_, id) => {
      // ✅ re-fetch answers of that question
      queryClient.invalidateQueries({ queryKey: ["answers"] });
      queryClient.invalidateQueries({ queryKey: ["answer", id] });
    },
  });
};

export const useVoteAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: "up" | "down" }) =>
      answerService.voteAnswer(id, type),
    onSuccess: (updatedAnswer) => {
      queryClient.invalidateQueries({
        queryKey: ["answers", updatedAnswer.question],
      });
      queryClient.invalidateQueries({
        queryKey: ["answer", updatedAnswer._id],
      });
    },
  });
};

export const useAcceptAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: answerService.acceptAnswer,
    onSuccess: (acceptedAnswer) => {
      queryClient.invalidateQueries({
        queryKey: ["answers", acceptedAnswer.question],
      });
      queryClient.invalidateQueries({
        queryKey: ["answer", acceptedAnswer._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["question", acceptedAnswer.question],
      });
    },
  });
};
