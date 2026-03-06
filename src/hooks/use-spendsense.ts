"use client";

import { useState, useEffect, useMemo } from 'react';
import { Expense, Category, BudgetGoal } from '@/lib/types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', icon: 'Utensils', color: '#f87171' },
  { id: '2', name: 'Transportation', icon: 'Car', color: '#60a5fa' },
  { id: '3', name: 'Shopping', icon: 'ShoppingBag', color: '#fbbf24' },
  { id: '4', name: 'Entertainment', icon: 'Film', color: '#a78bfa' },
  { id: '5', name: 'Utilities', icon: 'Zap', color: '#34d399' },
  { id: '6', name: 'Rent', icon: 'Home', color: '#f472b6' },
  { id: '7', name: 'Healthcare', icon: 'HeartPulse', color: '#fb7185' },
  { id: '8', name: 'Education', icon: 'GraduationCap', color: '#4fd8c4' },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', amount: 45.5, date: new Date().toISOString(), description: 'Lunch at Cafe', categoryId: '1' },
  { id: 'e2', amount: 120.0, date: new Date().toISOString(), description: 'Weekly Groceries', categoryId: '1' },
  { id: 'e3', amount: 35.0, date: new Date().toISOString(), description: 'Gas station', categoryId: '2' },
  { id: 'e4', amount: 850.0, date: new Date().toISOString(), description: 'Monthly Rent', categoryId: '6' },
  { id: 'e5', amount: 65.0, date: new Date().toISOString(), description: 'Electricity Bill', categoryId: '5' },
];

const INITIAL_BUDGETS: BudgetGoal[] = [
  { categoryId: 'overall', limit: 2500, period: 'monthly' },
  { categoryId: '1', limit: 500, period: 'monthly' },
  { categoryId: '3', limit: 200, period: 'monthly' },
];

export function useSpendSense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<BudgetGoal[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('ss_expenses');
    const savedCategories = localStorage.getItem('ss_categories');
    const savedBudgets = localStorage.getItem('ss_budgets');

    setExpenses(savedExpenses ? JSON.parse(savedExpenses) : INITIAL_EXPENSES);
    setCategories(savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES);
    setBudgets(savedBudgets ? JSON.parse(savedBudgets) : INITIAL_BUDGETS);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ss_expenses', JSON.stringify(expenses));
      localStorage.setItem('ss_categories', JSON.stringify(categories));
      localStorage.setItem('ss_budgets', JSON.stringify(budgets));
    }
  }, [expenses, categories, budgets, hydrated]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Math.random().toString(36).substr(2, 9) };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Math.random().toString(36).substr(2, 9) };
    setCategories(prev => [...prev, newCategory]);
  };

  const setBudget = (budget: BudgetGoal) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.categoryId === budget.categoryId);
      if (existing) {
        return prev.map(b => b.categoryId === budget.categoryId ? budget : b);
      }
      return [...prev, budget];
    });
  };

  const stats = useMemo(() => {
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const overallBudget = budgets.find(b => b.categoryId === 'overall')?.limit || 0;
    
    const spentByCategory = expenses.reduce((acc, curr) => {
      acc[curr.categoryId] = (acc[curr.categoryId] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    let topCategoryId = '';
    let maxSpent = 0;
    Object.entries(spentByCategory).forEach(([id, amount]) => {
      if (amount > maxSpent) {
        maxSpent = amount;
        topCategoryId = id;
      }
    });

    const topCategory = categories.find(c => c.id === topCategoryId)?.name || 'None';

    return {
      totalSpent,
      totalBudget: overallBudget,
      remainingBudget: Math.max(0, overallBudget - totalSpent),
      topCategory,
      spentByCategory
    };
  }, [expenses, budgets, categories]);

  return {
    expenses,
    categories,
    budgets,
    stats,
    addExpense,
    deleteExpense,
    addCategory,
    setBudget,
    hydrated
  };
}