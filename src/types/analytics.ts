export interface SpendingTrend {
  _id: {
    year: number;
    month?: number;
    week?: number;
    day?: number;
  };
  income: number;
  expenses: number;
}

export interface CategoryBreakdown {
  _id: string;
  amount: number;
}

export interface BudgetComparison {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface FinancialProjection {
  month: string;
  projectedIncome: number;
  projectedExpenses: number;
  projectedBalance: number;
}

export interface FinancialProjections {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  projections: FinancialProjection[];
  savingsGoal?: {
    target: number;
    current: number;
    projectedAchievement: boolean;
  };
}

export interface ExportParams {
  format: "csv" | "json";
  startDate?: string;
  endDate?: string;
}
