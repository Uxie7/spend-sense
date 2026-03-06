import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Category, BudgetGoal } from "@/lib/types";

interface BudgetProgressProps {
  categories: Category[];
  budgets: BudgetGoal[];
  spentByCategory: Record<string, number>;
}

export function BudgetProgress({ categories, budgets, spentByCategory }: BudgetProgressProps) {
  const categoryBudgets = budgets.filter(b => b.categoryId !== 'overall');

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
        <CardDescription>Category utilization this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {categoryBudgets.length > 0 ? (
          categoryBudgets.map(budget => {
            const category = categories.find(c => c.id === budget.categoryId);
            if (!category) return null;
            const spent = spentByCategory[budget.categoryId] || 0;
            const percentage = Math.min(100, (spent / budget.limit) * 100);
            const isOver = spent > budget.limit;

            return (
              <div key={budget.categoryId} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className={isOver ? "text-destructive font-semibold" : "text-muted-foreground"}>
                    ${spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                  style={{ 
                    backgroundColor: 'hsl(var(--muted))'
                  }}
                />
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No category budgets set.
          </div>
        )}
      </CardContent>
    </Card>
  );
}