"use client";

import { useSpendSense } from "@/hooks/use-spendsense";
import { Navbar } from "@/components/layout/Navbar";
import { Loader2, Target, Plus, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function BudgetsPage() {
  const { categories, budgets, setBudget, hydrated } = useSpendSense();
  const { toast } = useToast();
  
  const [editingBudget, setEditingBudget] = useState<{categoryId: string, limit: string}>({
    categoryId: '',
    limit: ''
  });

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleSaveBudget = (categoryId: string, limitStr: string) => {
    const limit = parseFloat(limitStr);
    if (isNaN(limit)) return;

    setBudget({
      categoryId,
      limit,
      period: 'monthly'
    });
    
    setEditingBudget({ categoryId: '', limit: '' });
    toast({ title: "Budget Updated", description: "Your financial goals have been saved." });
  };

  const overallBudget = budgets.find(b => b.categoryId === 'overall');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Budget Goals</h1>
          <p className="text-muted-foreground">Set limits to control your spending and save more.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <Card className="border-none shadow-sm bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Global Budget
                </CardTitle>
                <CardDescription className="text-primary-foreground/70">Overall monthly spending limit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">${overallBudget?.limit.toLocaleString() || '0'}</div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="New limit" 
                    type="number" 
                    className="bg-primary-foreground/10 border-none text-white placeholder:text-white/50"
                    value={editingBudget.categoryId === 'overall' ? editingBudget.limit : ''}
                    onChange={(e) => setEditingBudget({ categoryId: 'overall', limit: e.target.value })}
                  />
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    onClick={() => handleSaveBudget('overall', editingBudget.limit)}
                    disabled={editingBudget.categoryId !== 'overall' || !editingBudget.limit}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Category Budgets</h2>
            <div className="grid gap-4">
              {categories.map((cat) => {
                const budget = budgets.find(b => b.categoryId === cat.id);
                const isEditing = editingBudget.categoryId === cat.id;
                
                return (
                  <Card key={cat.id} className="border-none shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-semibold">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          {budget ? `$${budget.limit.toLocaleString()}` : "Not set"}
                        </span>
                        <div className="flex items-center gap-2">
                          <Input 
                            placeholder="New limit" 
                            type="number" 
                            className="w-24 h-8 text-xs"
                            value={isEditing ? editingBudget.limit : ''}
                            onChange={(e) => setEditingBudget({ categoryId: cat.id, limit: e.target.value })}
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleSaveBudget(cat.id, editingBudget.limit)}
                            disabled={!isEditing || !editingBudget.limit}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}