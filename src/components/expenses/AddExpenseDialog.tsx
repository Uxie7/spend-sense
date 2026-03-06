"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/lib/types";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { intelligentExpenseCategorization } from "@/ai/flows/intelligent-expense-categorization-flow";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseDialogProps {
  categories: Category[];
  onAdd: (expense: any) => void;
}

export function AddExpenseDialog({ categories, onAdd }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    categoryId: "",
    date: new Date().toISOString().split('T')[0]
  });

  const handleSuggestCategory = async () => {
    if (!formData.description) return;
    setLoading(true);
    try {
      const result = await intelligentExpenseCategorization({ description: formData.description });
      const matchedCategory = categories.find(c => c.name.toLowerCase().includes(result.suggestedCategory.toLowerCase()) || result.suggestedCategory.toLowerCase().includes(c.name.toLowerCase()));
      
      if (matchedCategory) {
        setFormData(prev => ({ ...prev, categoryId: matchedCategory.id }));
        toast({ title: "AI Suggested", description: `Categorized as ${matchedCategory.name}` });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId || !formData.description) return;
    
    onAdd({
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    });
    
    setFormData({
      description: "",
      amount: "",
      categoryId: "",
      date: new Date().toISOString().split('T')[0]
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <Input
                id="description"
                placeholder="Starbucks Coffee, Netflix, etc."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1 h-8 w-8 text-primary"
                onClick={handleSuggestCategory}
                disabled={loading || !formData.description}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, categoryId: val }))}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full mt-4">Save Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}