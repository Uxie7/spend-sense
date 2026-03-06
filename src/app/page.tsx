"use client";

import { useSpendSense } from "@/hooks/use-spendsense";
import { Navbar } from "@/components/layout/Navbar";
import { StatCards } from "@/components/dashboard/StatCards";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { AnomalyDetection } from "@/components/ai/AnomalyDetection";
import { Loader2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { expenses, categories, budgets, stats, addExpense, deleteExpense, hydrated } = useSpendSense();

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground">Welcome back, here's what's happening with your money.</p>
          </div>
          <div className="flex items-center gap-3">
            <AddExpenseDialog categories={categories} onAdd={addExpense} />
          </div>
        </div>

        <div className="space-y-8">
          <StatCards stats={stats} />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <SpendingChart spentByCategory={stats.spentByCategory} categories={categories} />
            </div>
            <div className="lg:col-span-2">
              <BudgetProgress 
                categories={categories} 
                budgets={budgets} 
                spentByCategory={stats.spentByCategory} 
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
                <Button variant="ghost" asChild size="sm">
                  <Link href="/expenses" className="flex items-center gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <ExpenseList 
                expenses={expenses} 
                categories={categories} 
                onDelete={deleteExpense} 
                limit={5}
              />
            </div>
            <div className="lg:col-span-1">
              <AnomalyDetection 
                expenses={expenses} 
                budgets={budgets} 
                categories={categories} 
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-10 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SpendSense Smart Finance. All rights reserved.
        </div>
      </footer>
    </div>
  );
}