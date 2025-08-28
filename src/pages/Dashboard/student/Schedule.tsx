import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  BookOpen,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Schedule: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState("week");

  const classes = [
    {
      id: 1,
      title: "Mathematics - Calculus",
      time: "09:00 - 10:30",
      location: "Room 301",
      instructor: "Dr. Smith",
      type: "lecture",
      day: "monday",
    },
    {
      id: 2,
      title: "Physics - Mechanics",
      time: "11:00 - 12:30",
      location: "Lab 205",
      instructor: "Prof. Johnson",
      type: "lab",
      day: "monday",
    },
    {
      id: 3,
      title: "Computer Science",
      time: "14:00 - 15:30",
      location: "Room 102",
      instructor: "Dr. Williams",
      type: "lecture",
      day: "tuesday",
    },
    {
      id: 4,
      title: "Mathematics Tutorial",
      time: "10:00 - 11:30",
      location: "Room 301",
      instructor: "TA Brown",
      type: "tutorial",
      day: "wednesday",
    },
    {
      id: 5,
      title: "Physics Discussion",
      time: "13:00 - 14:30",
      location: "Room 205",
      instructor: "Prof. Johnson",
      type: "discussion",
      day: "thursday",
    },
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      lecture: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      lab: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      tutorial:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      discussion:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Class Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your classes and track your weekly schedule
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar & Filters */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger>
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day View</SelectItem>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Search classes..." />

              <div className="space-y-2">
                <p className="text-sm font-medium">Class Types</p>
                {["lecture", "lab", "tutorial", "discussion"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input type="checkbox" id={type} defaultChecked />
                    <label htmlFor={type} className="text-sm capitalize">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Week View */}
              {selectedView === "week" && (
                <div className="grid grid-cols-6 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2"
                    >
                      {day}
                    </div>
                  ))}

                  {days.map((day) => (
                    <div
                      key={day}
                      className="min-h-[200px] border rounded-lg p-2"
                    >
                      {classes
                        .filter((cls) => cls.day === day)
                        .map((cls) => (
                          <div
                            key={cls.id}
                            className="p-3 mb-2 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <Badge className={getTypeColor(cls.type)}>
                                {cls.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {cls.time}
                              </span>
                            </div>
                            <h4 className="font-semibold mt-2 text-sm">
                              {cls.title}
                            </h4>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              {cls.location}
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {cls.instructor}
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Day View */}
              {selectedView === "day" && (
                <div className="space-y-4">
                  {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                    <div key={hour} className="flex border-b pb-4">
                      <div className="w-16 text-sm text-gray-500">
                        {hour}:00
                      </div>
                      <div className="flex-1">
                        {classes
                          .filter((cls) => {
                            const startHour = parseInt(cls.time.split(":")[0]);
                            return startHour === hour;
                          })
                          .map((cls) => (
                            <div
                              key={cls.id}
                              className="p-3 rounded-lg border bg-card mb-2"
                            >
                              <div className="flex items-center justify-between">
                                <Badge className={getTypeColor(cls.type)}>
                                  {cls.type}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {cls.time}
                                </span>
                              </div>
                              <h4 className="font-semibold mt-2">
                                {cls.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {cls.location}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.slice(0, 3).map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center p-3 rounded-lg border"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold">{cls.title}</h4>
                      <p className="text-sm text-gray-500">
                        {cls.time} • {cls.location}
                      </p>
                    </div>
                    <Badge className={getTypeColor(cls.type)}>{cls.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
