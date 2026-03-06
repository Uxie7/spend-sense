export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Expense = {
  id: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
};

export type BudgetGoal = {
  categoryId: string; // "overall" for global budget
  limit: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
};

export type DashboardStats = {
  totalSpent: number;
  totalBudget: number;
  topCategory: string;
  remainingBudget: number;
};