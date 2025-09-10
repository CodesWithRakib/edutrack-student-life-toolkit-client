export interface BudgetCategory {
  _id: string;
  user: string;
  category: string;
  budget: number;
  color: string;
  spent: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategoriesResponse {
  categories: BudgetCategory[];
  total?: number; // add if later you want pagination
}

export interface Transaction {
  _id: string;
  user: string;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

// 👇 Summary response type
export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface SavingsGoal {
  _id: string;
  user: string;
  target: number;
  current: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
