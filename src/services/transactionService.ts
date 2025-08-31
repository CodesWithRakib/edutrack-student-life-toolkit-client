import apiClient from "@/lib/apiClient";
import type { Transaction, TransactionSummary } from "@/types/budget";

export const transactionsService = {
  // ---------------- Transactions ----------------
  getTransactions: async (): Promise<Transaction[]> => {
    const { data } = await apiClient.get("/transactions");
    return data;
  },

  createTransaction: async (
    transaction: Omit<Transaction, "_id">
  ): Promise<Transaction> => {
    const { data } = await apiClient.post("/transactions", transaction);
    return data;
  },

  updateTransaction: async (
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction> => {
    const { data } = await apiClient.put(`/transactions/${id}`, updates);
    return data;
  },

  deleteTransaction: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/transactions/${id}`);
    return data;
  },

  getTransactionSummary: async (): Promise<TransactionSummary> => {
    const { data } = await apiClient.get("/transactions/summary");
    return data;
  },
};
