"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { budgetAnomalyDetection, BudgetAnomalyDetectionOutput } from "@/ai/flows/budget-anomaly-detection-flow";
import { Expense, BudgetGoal, Category } from "@/lib/types";
import { AlertTriangle, Lightbulb, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AnomalyDetectionProps {
  expenses: Expense[];
  budgets: BudgetGoal[];
  categories: Category[];
}

export function AnomalyDetection({ expenses, budgets, categories }: AnomalyDetectionProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BudgetAnomalyDetectionOutput | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const input = {
        spendingData: expenses.map(e => ({
          id: e.id,
          date: e.date,
          amount: e.amount,
          description: e.description,
          category: categories.find(c => c.id === e.categoryId)?.name || 'Unknown'
        })),
        budgetGoals: budgets.map(b => ({
          category: b.categoryId === 'overall' ? 'Overall' : (categories.find(c => c.id === b.categoryId)?.name || 'Unknown'),
          limit: b.limit,
          period: b.period
        }))
      };

      const analysis = await budgetAnomalyDetection(input);
      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              SpendSense AI Analyst
            </CardTitle>
            <CardDescription>Intelligent pattern detection and budget recommendations</CardDescription>
          </div>
          <Button onClick={runAnalysis} disabled={loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Analyze Patterns
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {!result && !loading && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="font-medium text-lg">Ready to Analyze</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Our AI will look at your spending history and budget goals to find hidden patterns and suggest improvements.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-sm font-medium animate-pulse">Scanning transactions and calculating trends...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium italic text-accent-foreground">"{result.summary}"</p>
            </div>

            {result.anomalies.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Detected Anomalies
                </h4>
                <div className="grid gap-3">
                  {result.anomalies.map((anomaly, idx) => (
                    <Alert key={idx} variant={anomaly.type === 'overspending' ? 'destructive' : 'default'}>
                      <AlertTitle className="text-xs uppercase font-bold">{anomaly.type.replace('_', ' ')}</AlertTitle>
                      <AlertDescription className="text-sm">
                        {anomaly.description}
                        {anomaly.suggestedAction && (
                          <div className="mt-2 text-xs font-semibold underline">
                            Action: {anomaly.suggestedAction}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Budget Recommendations
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {result.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="p-3 border rounded-lg bg-card shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold">{suggestion.category}</span>
                        <span className="text-xs font-mono bg-primary/10 px-1.5 py-0.5 rounded">
                          Suggest: ${suggestion.suggestedLimit}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.anomalies.length === 0 && result.suggestions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-green-50 border border-green-100 rounded-xl">
                <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                <h4 className="font-bold text-green-800">Everything looks great!</h4>
                <p className="text-sm text-green-700">No anomalies detected in your current spending period.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}