import apiClient from "@/lib/apiClient";
import type {
  BudgetComparison,
  CategoryBreakdown,
  ExportParams,
  FinancialProjections,
  SpendingTrend,
} from "@/types/analytics";

export const getSpendingTrends = async (
  period: string,
  months: number
): Promise<SpendingTrend[]> => {
  const response = await apiClient.get(
    `/analytics/spending-trends?period=${period}&months=${months}`
  );
  return response.data;
};

export const getCategoryBreakdown = async (
  period: string
): Promise<CategoryBreakdown[]> => {
  const response = await apiClient.get(
    `/analytics/category-breakdown?period=${period}`
  );
  return response.data;
};

export const getBudgetComparison = async (
  period: string
): Promise<BudgetComparison[]> => {
  const response = await apiClient.get(
    `/analytics/budget-comparison?period=${period}`
  );
  return response.data;
};

export const getFinancialProjections = async (
  months: number
): Promise<FinancialProjections> => {
  const response = await apiClient.get(
    `/analytics/financial-projections?months=${months}`
  );
  return response.data;
};

export const exportTransactions = async (
  params: ExportParams
): Promise<Blob> => {
  const { format, startDate, endDate } = params;
  const queryParams = new URLSearchParams();
  queryParams.append("format", format);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);

  const response = await apiClient.get(
    `/analytics/export?${queryParams.toString()}`,
    {
      responseType: "blob",
    }
  );
  return response.data;
};
