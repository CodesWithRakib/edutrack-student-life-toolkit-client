"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Class } from "@/types/schedule";

interface Props {
  classes: Class[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

export default function AnalyticsDashboard({ classes }: Props) {
  const total = classes.length;

  const byType = Object.entries(
    classes.reduce<Record<string, number>>((acc, cls) => {
      acc[cls.type] = (acc[cls.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, count]) => ({ name: type, value: count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Total Classes: {total}</p>
        <div className="h-56">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={byType}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {byType.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
