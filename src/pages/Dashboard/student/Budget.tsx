import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Calendar,
  Edit,
  Trash2,
  Loader2,
  Target,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { budgetService } from "@/services/budgetService";
import type { BudgetCategory, Transaction } from "@/types/budget";
import { transactionsService } from "@/services/transactionService";
import AddTransactionDialog from "@/components/dashboard/student/AddTransactionDialog";
import AddBudgetCategoryDialog from "@/components/dashboard/student/AddBudgetCategoryDialog";
import EditBudgetCategoryDialog from "@/components/dashboard/student/EditBudgetCategoryDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Budget: React.FC = () => {
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState("month");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(
    null
  );

  // Fetch transactions
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: transactionsService.getTransactions,
  });

  // Fetch budget categories
  const {
    data: budgetCategories = [],
    isLoading: budgetCategoriesLoading,
    error: budgetCategoriesError,
  } = useQuery<BudgetCategory[]>({
    queryKey: ["budget-categories"],
    queryFn: budgetService.getBudgetCategories,
  });

  // Fetch transaction summary
  const {
    data: transactionSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["transaction-summary"],
    queryFn: budgetService.getTransactionSummary,
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: transactionsService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-summary"] });
      toast.success("Transaction deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });

  // Delete budget category mutation
  const deleteBudgetCategoryMutation = useMutation({
    mutationFn: budgetService.deleteBudgetCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-categories"] });
      toast.success("Budget category deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete budget category");
    },
  });

  // Calculate totals from transactions
  const calculateTotals = () => {
    if (transactions.length === 0) {
      return { totalIncome: 0, totalExpenses: 0, balance: 0 };
    }
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, balance };
  };

  const { totalIncome, totalExpenses, balance } =
    transactionSummary || calculateTotals();

  // Handle transaction deletion
  const handleDeleteTransaction = (id: string) => {
    deleteTransactionMutation.mutate(id);
  };

  // Handle budget category deletion
  const handleDeleteBudgetCategory = (id: string) => {
    deleteBudgetCategoryMutation.mutate(id);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (summaryLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading budget data...
          </p>
        </div>
      </div>
    );
  }

  if (transactionsError || budgetCategoriesError || summaryError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm max-w-md border border-red-100 dark:border-red-900/30">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error loading budget data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please try again later
          </p>
          <Button
            onClick={() => queryClient.invalidateQueries()}
            variant="outline"
            className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Budget Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your expenses and track your financial health
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddBudget(true)}
              className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 border-gray-200 dark:border-gray-700"
            >
              <Plus className="h-4 w-4" />
              Budget Category
            </Button>
            <Button
              onClick={() => setShowAddTransaction(true)}
              className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <div className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Total Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div
                className={`text-2xl font-bold ${
                  balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${balance?.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {balance >= 0 ? "Positive balance" : "Negative balance"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <div className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                  Total Income
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">
                ${totalIncome?.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                All income sources
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <div className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
                  Total Expenses
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses?.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                All expenses
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Progress */}
          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-blue-700 dark:text-blue-400">
                  Budget Categories
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddBudget(true)}
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {budgetCategoriesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : budgetCategories.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-500">
                  <PiggyBank className="h-16 w-16 mx-auto mb-3 opacity-30" />
                  <p className="text-lg">No budget categories yet</p>
                  <Button
                    variant="link"
                    onClick={() => setShowAddBudget(true)}
                    className="text-blue-500 hover:text-blue-700 mt-2"
                  >
                    Create your first budget category
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {budgetCategories.map((item) => {
                    const percentage = (item.spent / item.budget) * 100;
                    const isOverBudget = percentage > 100;
                    const isNearLimit = percentage > 90 && percentage <= 100;

                    return (
                      <div key={item._id} className="space-y-2 group">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">
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
                                className="text-xs border-amber-500 text-amber-600 dark:text-amber-400"
                              >
                                Near Limit
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 flex-1">
                            <Progress
                              value={Math.min(percentage, 100)}
                              className={`h-2.5 transition-all duration-500 ${
                                isOverBudget
                                  ? "[&>div]:bg-red-500"
                                  : isNearLimit
                                  ? "[&>div]:bg-amber-500"
                                  : "[&>div]:bg-green-500"
                              }`}
                            />
                          </div>
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  onClick={() => setEditingBudget(item)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit budget</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  onClick={() =>
                                    handleDeleteBudgetCategory(item._id)
                                  }
                                  disabled={
                                    deleteBudgetCategoryMutation.isPending
                                  }
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete budget</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-blue-700 dark:text-blue-400">
                  Recent Transactions
                </CardTitle>
                <div className="flex gap-2">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[120px] shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {transactionsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                        <div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-500">
                  <Wallet className="h-16 w-16 mx-auto mb-3 opacity-30" />
                  <p className="text-lg">No transactions yet</p>
                  <Button
                    variant="link"
                    onClick={() => setShowAddTransaction(true)}
                    className="text-blue-500 hover:text-blue-700 mt-2"
                  >
                    Add your first transaction
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/30 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            transaction.type === "income"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {transaction.category}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {transaction.date
                              ? formatDate(transaction.date)
                              : "No date"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-semibold ${
                            transaction.type === "income"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toFixed(2)}
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() =>
                                handleDeleteTransaction(transaction._id!)
                              }
                              disabled={deleteTransactionMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete transaction</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Savings Goal */}
        <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
            <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Savings Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Target: $1000
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Current: ${balance >= 0 ? balance.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <Progress
                  value={Math.min((balance / 1000) * 100, 100)}
                  className="h-3 transition-all duration-700 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.min((balance / 1000) * 100, 100).toFixed(0)}% completed
                </p>
                <Badge variant="outline" className="text-xs">
                  ${Math.max(1000 - balance, 0).toFixed(2)} remaining
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <AddTransactionDialog
          open={showAddTransaction}
          onOpenChange={setShowAddTransaction}
          budgetCategories={budgetCategories}
        />
        <AddBudgetCategoryDialog
          open={showAddBudget}
          onOpenChange={setShowAddBudget}
        />
        {editingBudget && (
          <EditBudgetCategoryDialog
            open={!!editingBudget}
            onOpenChange={(open) => !open && setEditingBudget(null)}
            budgetCategory={editingBudget}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default Budget;
