"use client";

import { useSpendSense } from "@/hooks/use-spendsense";
import { Navbar } from "@/components/layout/Navbar";
import { Loader2, Tags, Plus, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CategoriesPage() {
  const { categories, addCategory, hydrated } = useSpendSense();
  const { toast } = useToast();
  
  const [newCat, setNewCat] = useState({ name: '', color: '#3b82f6' });

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name) return;
    
    addCategory({
      name: newCat.name,
      color: newCat.color,
      icon: 'Tag'
    });
    
    setNewCat({ name: '', color: '#3b82f6' });
    toast({ title: "Category Created", description: `${newCat.name} is now available.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Organize your expenses into meaningful groups.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="border-none shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle>Create Category</CardTitle>
                <CardDescription>Add a custom spending group</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="catName">Name</Label>
                    <Input 
                      id="catName" 
                      placeholder="e.g. Subscriptions" 
                      value={newCat.name}
                      onChange={(e) => setNewCat(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catColor">Label Color</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        id="catColor" 
                        type="color" 
                        className="w-12 h-10 p-1 cursor-pointer"
                        value={newCat.color}
                        onChange={(e) => setNewCat(prev => ({ ...prev, color: e.target.value }))}
                      />
                      <span className="text-sm font-mono text-muted-foreground">{newCat.color}</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Plus className="h-4 w-4" /> Create
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Existing Categories</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  >
                    <Tags className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{cat.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{cat.color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}