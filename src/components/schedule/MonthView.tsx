"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Class } from "@/types/schedule";

interface Props {
  classes: Class[];
}

export default function MonthView({ classes }: Props) {
  const daysInMonth = 30; // simplify
  const today = new Date().getDate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Month View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dayClasses = classes.filter(
              (cls) => parseInt(cls.date?.split("-")[2] || "0") === day
            );
            return (
              <div
                key={day}
                className={`p-2 rounded-md border ${
                  day === today ? "bg-primary/10 border-primary" : ""
                }`}
              >
                <div className="font-semibold text-sm mb-1">{day}</div>
                {dayClasses.map((cls) => (
                  <div
                    key={cls._id}
                    className="text-xs truncate rounded bg-muted p-1 mb-1"
                  >
                    {cls.subject}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
