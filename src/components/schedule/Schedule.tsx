"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import AddClassDialog from "./AddClassDialog";
import WeeklyScheduleGrid from "./WeeklyScheduleGrid";
import DayView from "./DayView";
import MonthView from "./MonthView";
import UpcomingClasses from "./UpcomingClasses";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { Class } from "@/types/schedule";

export default function Schedule() {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const { data: classes = [], isLoading } = useQuery<Class[]>({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await fetch("/api/classes");
      return res.json();
    },
  });

  const filteredClasses = useMemo(() => {
    return classes.filter(
      (cls) =>
        (cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.instructor.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedTypes.length === 0 || selectedTypes.includes(cls.type))
    );
  }, [classes, searchTerm, selectedTypes]);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Class Schedule</h1>
        <AddClassDialog />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Search by subject or instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={view}
          onValueChange={(val) => setView(val as "day" | "week" | "month")}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day View</SelectItem>
            <SelectItem value="week">Week View</SelectItem>
            <SelectItem value="month">Month View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-[300px]" />
      ) : (
        <Tabs
          defaultValue={view}
          value={view}
          onValueChange={(v) => setView(v as any)}
        >
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>

          <TabsContent value="day">
            <DayView classes={filteredClasses} />
          </TabsContent>

          <TabsContent value="week">
            <WeeklyScheduleGrid classes={filteredClasses} />
          </TabsContent>

          <TabsContent value="month">
            <MonthView classes={filteredClasses} />
          </TabsContent>
        </Tabs>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <UpcomingClasses classes={classes} />
        <AnalyticsDashboard classes={classes} />
      </div>
    </div>
  );
}
