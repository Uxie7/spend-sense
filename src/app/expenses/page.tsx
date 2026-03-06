"use client";

import { useSpendSense } from "@/hooks/use-spendsense";
import { Navbar } from "@/components/layout/Navbar";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

export default function ExpensesPage() {
  const { expenses, categories, addExpense, deleteExpense, hydrated } = useSpendSense();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = useMemo(() => {
    if (!searchTerm) return expenses;
    return expenses.filter(e => 
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories.find(c => c.id === e.categoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenses, searchTerm, categories]);

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
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">Detailed history of all your transactions.</p>
          </div>
          <AddExpenseDialog categories={categories} onAdd={addExpense} />
        </div>

        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search expenses..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ExpenseList 
            expenses={filteredExpenses} 
            categories={categories} 
            onDelete={deleteExpense} 
          />
        </div>
      </main>
    </div>
  );
}