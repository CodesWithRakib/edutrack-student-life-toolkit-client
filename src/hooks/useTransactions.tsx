import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Transaction, TransactionSummary } from "@/types/budget";
import { transactionsService } from "@/services/transactionService";

// Fetch all transactions
export function useTransactions() {
  return useQuery<Transaction[], Error>({
    queryKey: ["transactions"],
    queryFn: transactionsService.getTransactions,
  });
}

// Fetch transaction summary
export function useTransactionSummary() {
  return useQuery<TransactionSummary, Error>({
    queryKey: ["transactions-summary"],
    queryFn: transactionsService.getTransactionSummary,
  });
}

// Create transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, Omit<Transaction, "_id">>({
    mutationFn: transactionsService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-summary"] });
    },
  });
}

// Update transaction
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation<
    Transaction,
    Error,
    { id: string; updates: Partial<Transaction> }
  >({
    mutationFn: ({ id, updates }) =>
      transactionsService.updateTransaction(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-summary"] });
    },
  });
}

// Delete transaction
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: transactionsService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-summary"] });
    },
  });
}
