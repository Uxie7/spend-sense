import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category, Expense } from "@/lib/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => void;
  limit?: number;
}

export function ExpenseList({ expenses, categories, onDelete, limit }: ExpenseListProps) {
  const displayExpenses = limit ? expenses.slice(0, limit) : expenses;

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayExpenses.length > 0 ? (
            displayExpenses.map((expense) => {
              const category = categories.find(c => c.id === expense.categoryId);
              return (
                <TableRow key={expense.id}>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <span 
                      className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: category?.color || '#ccc' }}
                    >
                      {category?.name || 'Uncategorized'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(expense.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No expenses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}