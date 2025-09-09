import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { BudgetCategory, Transaction } from "@/types/budget";
import TransactionDialog from "@/components/dashboard/student/TransactionDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useBudgetCategories,
  useDeleteBudgetCategory,
} from "@/hooks/useBudgetCategories";
import {
  useTransactions,
  useDeleteTransaction,
  useTransactionSummary,
} from "@/hooks/useTransactions";
import BudgetCategoryDialog from "@/components/dashboard/student/BudgetCategoryDialog";
import { useSavingsGoal, useUpdateSavingsGoal } from "@/hooks/useSavingsGoal";

const Budget: React.FC = () => {
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState("month");
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(
    null
  );
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showSavingsGoalDialog, setShowSavingsGoalDialog] = useState(false);

  // Use your custom hooks
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useTransactions();
  const { data: budgetCategories = [], isLoading: budgetCategoriesLoading } =
    useBudgetCategories();
  const {
    data: transactionSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useTransactionSummary();
  const { data: savingsGoal, isLoading: savingsGoalLoading } = useSavingsGoal();

  // Use your custom mutation hooks
  const deleteTransactionMutation = useDeleteTransaction();
  const deleteBudgetCategoryMutation = useDeleteBudgetCategory();
  const updateSavingsGoalMutation = useUpdateSavingsGoal();

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

  // Handle transaction editing
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setTransactionDialogOpen(true);
  };

  // Handle savings goal update
  const handleUpdateSavingsGoal = (target: number) => {
    updateSavingsGoalMutation.mutate(
      { target },
      {
        onSuccess: () => {
          setShowSavingsGoalDialog(false);
        },
      }
    );
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

  if (transactionsError || summaryError) {
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
              onClick={() => {
                setEditingBudget(null);
                setBudgetDialogOpen(true);
              }}
              className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 border-gray-200 dark:border-gray-700"
            >
              <Plus className="h-4 w-4" />
              Budget Category
            </Button>
            <Button
              onClick={() => {
                setEditingTransaction(null);
                setTransactionDialogOpen(true);
              }}
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
                  onClick={() => {
                    setEditingBudget(null);
                    setBudgetDialogOpen(true);
                  }}
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
                    onClick={() => {
                      setEditingBudget(null);
                      setBudgetDialogOpen(true);
                    }}
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
                                  onClick={() => {
                                    setEditingBudget(item);
                                    setBudgetDialogOpen(true);
                                  }}
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
                    onClick={() => {
                      setEditingTransaction(null);
                      setTransactionDialogOpen(true);
                    }}
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
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              onClick={() => handleEditTransaction(transaction)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit transaction</TooltipContent>
                        </Tooltip>
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
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Savings Goal
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavingsGoalDialog(true)}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {savingsGoalLoading ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Target: ${savingsGoal?.target?.toFixed(2) || "0.00"}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Current: ${balance >= 0 ? balance.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <Progress
                    value={Math.min(
                      (balance / (savingsGoal?.target || 1)) * 100,
                      100
                    )}
                    className="h-3 transition-all duration-700 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.min(
                      (balance / (savingsGoal?.target || 1)) * 100,
                      100
                    ).toFixed(0)}
                    % completed
                  </p>
                  <Badge variant="outline" className="text-xs">
                    $
                    {Math.max((savingsGoal?.target || 0) - balance, 0).toFixed(
                      2
                    )}{" "}
                    remaining
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Dialogs */}
        <TransactionDialog
          open={transactionDialogOpen}
          onOpenChange={(open) => {
            setTransactionDialogOpen(open);
            if (!open) setEditingTransaction(null);
          }}
          budgetCategories={budgetCategories}
          transaction={editingTransaction}
        />
        <BudgetCategoryDialog
          open={budgetDialogOpen}
          onOpenChange={(open) => {
            setBudgetDialogOpen(open);
            if (!open) setEditingBudget(null);
          }}
          budgetCategory={editingBudget}
        />
        {/* Savings Goal Dialog */}
        <Dialog
          open={showSavingsGoalDialog}
          onOpenChange={setShowSavingsGoalDialog}
        >
          <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-0 shadow-xl">
            <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Set Savings Goal
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="target"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Target Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                      $
                    </span>
                  </div>
                  <Input
                    id="target"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={savingsGoal?.target || 0}
                    className="pl-8 shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  const targetInput = document.getElementById(
                    "target"
                  ) as HTMLInputElement;
                  const target = parseFloat(targetInput.value);
                  if (isNaN(target) || target <= 0) {
                    toast.error("Please enter a valid target amount");
                    return;
                  }
                  handleUpdateSavingsGoal(target);
                }}
                className="w-full shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                disabled={updateSavingsGoalMutation.isPending}
              >
                {updateSavingsGoalMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Set Goal
                  </div>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Budget;
