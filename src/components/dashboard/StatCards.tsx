import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wallet, TrendingUp, PieChart } from "lucide-react";

interface StatCardsProps {
  stats: {
    totalSpent: number;
    totalBudget: number;
    remainingBudget: number;
    topCategory: string;
  };
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      description: "This month's expenses",
      color: "text-primary"
    },
    {
      title: "Monthly Budget",
      value: `$${stats.totalBudget.toLocaleString()}`,
      icon: Wallet,
      description: "Target monthly limit",
      color: "text-accent"
    },
    {
      title: "Remaining",
      value: `$${stats.remainingBudget.toLocaleString()}`,
      icon: TrendingUp,
      description: "Available to spend",
      color: stats.remainingBudget < 200 ? "text-destructive" : "text-green-500"
    },
    {
      title: "Top Category",
      value: stats.topCategory,
      icon: PieChart,
      description: "Highest spending area",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}