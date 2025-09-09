"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ClassCard from "./ClassCard";
import { Class } from "@/types/schedule";

interface Props {
  classes: Class[];
}

export default function DayView({ classes }: Props) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayClasses = classes.filter(
    (cls) => cls.day.toLowerCase() === today.toLowerCase()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Schedule ({today})</CardTitle>
      </CardHeader>
      <CardContent>
        {todayClasses.length > 0 ? (
          todayClasses.map((cls) => <ClassCard key={cls._id} cls={cls} />)
        ) : (
          <p className="text-muted-foreground">No classes today 🎉</p>
        )}
      </CardContent>
    </Card>
  );
}
