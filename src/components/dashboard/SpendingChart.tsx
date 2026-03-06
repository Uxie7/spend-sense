"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Category } from "@/lib/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface SpendingChartProps {
  spentByCategory: Record<string, number>;
  categories: Category[];
}

export function SpendingChart({ spentByCategory, categories }: SpendingChartProps) {
  const data = categories
    .map(cat => ({
      name: cat.name,
      value: spentByCategory[cat.id] || 0,
      color: cat.color
    }))
    .filter(d => d.value > 0);

  const chartConfig = categories.reduce((acc, cat) => {
    acc[cat.name] = {
      label: cat.name,
      color: cat.color
    };
    return acc;
  }, {} as any);

  return (
    <Card className="flex flex-col border-none shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending Distribution</CardTitle>
        <CardDescription>Breakdown by Category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[250px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border rounded shadow-sm text-xs">
                          <p className="font-bold">{payload[0].name}</p>
                          <p>${(payload[0].value as number).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No data to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}