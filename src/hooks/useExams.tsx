import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examService } from "@/services/examService";
import type { Exam } from "@/types/exam";

export const useExams = () => {
  const queryClient = useQueryClient();

  // 🔹 Fetch all exams
  const {
    data: exams,
    isLoading,
    isError,
  } = useQuery<Exam[]>({
    queryKey: ["exams"],
    queryFn: examService.getAll,
  });

  // 🔹 Fetch single exam by id
  const useExam = (id: string) =>
    useQuery<Exam>({
      queryKey: ["exams", id],
      queryFn: () => examService.getById(id),
      enabled: !!id,
    });

  // 🔹 Generate new exam
  const generateExam = useMutation({
    mutationFn: examService.generate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });

  // 🔹 Update exam
  const updateExam = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Exam> }) =>
      examService.update(id, data),
    onSuccess: (exam) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", exam._id] });
    },
  });

  // 🔹 Delete exam
  const deleteExam = useMutation({
    mutationFn: examService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });

  // 🔹 Submit exam answers
  const submitExam = useMutation({
    mutationFn: ({
      id,
      answers,
    }: {
      id: string;
      answers: Record<string, string>;
    }) => examService.submit(id, { answers }),
  });

  return {
    exams,
    isLoading,
    isError,
    useExam,
    generateExam,
    updateExam,
    deleteExam,
    submitExam, // ✅ added
  };
};
