import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  useSpendingTrends,
  useCategoryBreakdown,
  useBudgetComparison,
  useFinancialProjections,
} from "@/hooks/useAnalytics";
import { exportTransactions } from "@/services/analyticsService";
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import type {
  BudgetComparison,
  CategoryBreakdown,
  SpendingTrend,
} from "@/types/analytics";
import type { AxiosError } from "axios";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

const AnalyticsDashboard: React.FC = () => {
  const [trendsPeriod, setTrendsPeriod] = useState<string>("month");
  const [trendsMonths, setTrendsMonths] = useState<number>(6);
  const [breakdownPeriod, setBreakdownPeriod] = useState<string>("month");
  const [comparisonPeriod, setComparisonPeriod] = useState<string>("month");
  const [projectionMonths, setProjectionMonths] = useState<number>(3);

  const { data: spendingTrends = [], isLoading: trendsLoading } =
    useSpendingTrends(trendsPeriod, trendsMonths);
  const { data: categoryBreakdown = [], isLoading: breakdownLoading } =
    useCategoryBreakdown(breakdownPeriod);
  const { data: budgetComparison = [], isLoading: comparisonLoading } =
    useBudgetComparison(comparisonPeriod);
  const { data: financialProjections, isLoading: projectionsLoading } =
    useFinancialProjections(projectionMonths);

  const handleExport = async (format: "csv" | "json") => {
    try {
      await exportTransactions({ format });
      toast.success(`Data exported as ${format.toUpperCase()}`);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log(axiosError);
      toast.error("Export failed");
    }
  };

  // Format spending trends data for chart
  const formatTrendsData = () => {
    return spendingTrends.map((item: SpendingTrend) => {
      let label: string;
      if (trendsPeriod === "month") {
        label = new Date(
          item._id.year,
          (item._id.month || 1) - 1
        ).toLocaleString("default", { month: "short", year: "numeric" });
      } else if (trendsPeriod === "week") {
        label = `Week ${item._id.week}, ${item._id.year}`;
      } else {
        label = new Date(
          item._id.year,
          (item._id.month || 1) - 1,
          item._id.day || 1
        ).toLocaleDateString();
      }

      return {
        name: label,
        income: item.income,
        expenses: item.expenses,
        balance: item.income - item.expenses,
      };
    });
  };

  // Format category breakdown data for chart
  const formatCategoryData = () => {
    return categoryBreakdown.map((item: CategoryBreakdown) => ({
      name: item._id,
      value: item.amount,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Financial Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your spending patterns and financial health
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={trendsPeriod}
            onValueChange={(value: string) => setTrendsPeriod(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport("json")}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Spending Trends Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Spending Trends
            </CardTitle>
            <div className="flex gap-2">
              <Select
                value={trendsMonths.toString()}
                onValueChange={(value: string) =>
                  setTrendsMonths(parseInt(value))
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trendsLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={formatTrendsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Expense Breakdown
              </CardTitle>
              <Select
                value={breakdownPeriod}
                onValueChange={(value: string) => setBreakdownPeriod(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {breakdownLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={formatCategoryData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                      name,
                      percent,
                    }: {
                      name: string;
                      percent: number;
                    }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {formatCategoryData().map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Budget Comparison */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Budget vs Actual
              </CardTitle>
              <Select
                value={comparisonPeriod}
                onValueChange={(value: string) => setComparisonPeriod(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {comparisonLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {budgetComparison.map(
                  (item: BudgetComparison, index: number) => {
                    const isOverBudget = item.percentage > 100;
                    const isNearLimit =
                      item.percentage > 90 && item.percentage <= 100;

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.category}</span>
                          <div className="flex items-center gap-2">
                            <span>
                              ${item.spent.toFixed(2)} / $
                              {item.budget.toFixed(2)}
                            </span>
                            {isOverBudget && (
                              <Badge variant="destructive" className="text-xs">
                                Over Budget
                              </Badge>
                            )}
                            {isNearLimit && (
                              <Badge
                                variant="outline"
                                className="text-xs border-amber-500 text-amber-600"
                              >
                                Near Limit
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <Progress
                            value={Math.min(item.percentage, 100)}
                            className={`h-2.5 ${
                              isOverBudget
                                ? "[&>div]:bg-red-500"
                                : isNearLimit
                                ? "[&>div]:bg-amber-500"
                                : "[&>div]:bg-green-500"
                            }`}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{item.percentage.toFixed(0)}% of budget</span>
                          <span>${item.remaining.toFixed(2)} remaining</span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Projections */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Financial Projections
            </CardTitle>
            <Select
              value={projectionMonths.toString()}
              onValueChange={(value: string) =>
                setProjectionMonths(parseInt(value))
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {projectionsLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Current Balance
                  </p>
                  <p className="text-2xl font-bold">
                    $
                    {financialProjections?.currentBalance?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Avg. Monthly Income
                  </p>
                  <p className="text-2xl font-bold">
                    ${financialProjections?.monthlyIncome?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Avg. Monthly Expenses
                  </p>
                  <p className="text-2xl font-bold">
                    $
                    {financialProjections?.monthlyExpenses?.toFixed(2) ||
                      "0.00"}
                  </p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialProjections?.projections || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, "Amount"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="projectedIncome"
                    name="Projected Income"
                    fill="#10B981"
                  />
                  <Bar
                    dataKey="projectedExpenses"
                    name="Projected Expenses"
                    fill="#EF4444"
                  />
                  <Bar
                    dataKey="projectedBalance"
                    name="Projected Balance"
                    fill="#3B82F6"
                  />
                </BarChart>
              </ResponsiveContainer>

              {financialProjections?.savingsGoal && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-700 dark:text-indigo-300">
                        Savings Goal
                      </p>
                      <p className="font-medium">
                        ${financialProjections.savingsGoal.current.toFixed(2)}{" "}
                        of ${financialProjections.savingsGoal.target.toFixed(2)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        financialProjections.savingsGoal.projectedAchievement
                          ? "default"
                          : "outline"
                      }
                    >
                      {financialProjections.savingsGoal.projectedAchievement
                        ? "On track to achieve goal"
                        : "Not on track to achieve goal"}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                    <Progress
                      value={
                        (financialProjections.savingsGoal.current /
                          financialProjections.savingsGoal.target) *
                        100
                      }
                      className="h-2.5 [&>div]:bg-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
