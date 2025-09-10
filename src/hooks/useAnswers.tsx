// hooks/useAnswers.ts
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
    placeholderData: keepPreviousData,
    enabled: !!questionId,
    select: (data) => data, // The response is already in the correct format
  });
};

// ----------------- Mutations -----------------
export const useCreateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: answerService.createAnswer,
    onSuccess: (response) => {
      // Extract the answer from the response
      const newAnswer = response.data;

      // Invalidate the answers query for this question
      queryClient.invalidateQueries({
        queryKey: ["answers", newAnswer.question],
      });

      // Also invalidate the question to update answer count
      queryClient.invalidateQueries({
        queryKey: ["question", newAnswer.question],
      });
    },
  });
};

export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Answer> }) =>
      answerService.updateAnswer(id, updates),
    onSuccess: (response) => {
      const updatedAnswer = response.data;

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
    onSuccess: (response, variables) => {
      // We don't have the question ID from the response, so we need to handle this differently
      // One approach is to invalidate all answer queries
      queryClient.invalidateQueries({ queryKey: ["answers"] });

      // Also invalidate the specific answer
      queryClient.invalidateQueries({
        queryKey: ["answer", variables],
      });
    },
  });
};

export const useVoteAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: "up" | "down" }) =>
      answerService.voteAnswer(id, type),
    onSuccess: (response) => {
      const updatedAnswer = response.data;

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
    onSuccess: (response) => {
      const acceptedAnswer = response.data;

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
