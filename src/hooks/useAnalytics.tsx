import {
  getBudgetComparison,
  getCategoryBreakdown,
  getFinancialProjections,
  getSpendingTrends,
} from "@/services/analyticsService";
import type {
  BudgetComparison,
  CategoryBreakdown,
  FinancialProjections,
  SpendingTrend,
} from "@/types/analytics";
import { useQuery } from "@tanstack/react-query";

export const useSpendingTrends = (
  period: string = "month",
  months: number = 6
) => {
  return useQuery<SpendingTrend[]>({
    queryKey: ["analytics", "spending-trends", period, months],
    queryFn: () => getSpendingTrends(period, months),
  });
};

export const useCategoryBreakdown = (period: string = "month") => {
  return useQuery<CategoryBreakdown[]>({
    queryKey: ["analytics", "category-breakdown", period],
    queryFn: () => getCategoryBreakdown(period),
  });
};

export const useBudgetComparison = (period: string = "month") => {
  return useQuery<BudgetComparison[]>({
    queryKey: ["analytics", "budget-comparison", period],
    queryFn: () => getBudgetComparison(period),
  });
};

export const useFinancialProjections = (months: number = 3) => {
  return useQuery<FinancialProjections>({
    queryKey: ["analytics", "financial-projections", months],
    queryFn: () => getFinancialProjections(months),
  });
};
