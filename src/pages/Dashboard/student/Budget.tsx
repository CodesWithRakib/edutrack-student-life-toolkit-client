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
    return <Loader2 className="animate-spin w-5 h-5" />;
  }

  if (transactionsError || budgetCategoriesError || summaryError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Error loading budget data
          </h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
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
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Budget Category
          </Button>
          <Button
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${balance?.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {balance >= 0 ? "Positive balance" : "Negative balance"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome?.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">All income sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses?.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">All expenses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Budget Categories</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddBudget(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {budgetCategoriesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : budgetCategories.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <PiggyBank className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No budget categories yet</p>
                <Button variant="link" onClick={() => setShowAddBudget(true)}>
                  Create your first budget category
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {budgetCategories.map((item) => {
                  const percentage = (item.spent / item.budget) * 100;
                  const colorClass =
                    percentage > 90
                      ? "bg-red-500"
                      : percentage > 75
                      ? "bg-amber-500"
                      : "bg-green-500";

                  return (
                    <div key={item._id} className="space-y-2 group">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span>
                          ${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 flex-1">
                          <div
                            className={`h-2 rounded-full ${colorClass} transition-all`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setEditingBudget(item)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleDeleteBudgetCategory(item._id)}
                            disabled={deleteBudgetCategoryMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter" />
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
            {transactionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No transactions yet</p>
                <Button
                  variant="link"
                  onClick={() => setShowAddTransaction(true)}
                >
                  Add your first transaction
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3 rounded-lg border group"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.category}</p>
                        <p className="text-sm text-gray-500 flex items-center">
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
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        onClick={() =>
                          handleDeleteTransaction(transaction._id!)
                        }
                        disabled={deleteTransactionMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Savings Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Savings Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Target: $1000</span>
              <span>
                Current: ${balance >= 0 ? balance.toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-green-500 transition-all"
                style={{ width: `${Math.min((balance / 1000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {Math.min((balance / 1000) * 100, 100).toFixed(0)}% completed • $
              {Math.max(1000 - balance, 0).toFixed(2)} remaining
            </p>
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
  );
};

export default Budget;
