import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar,
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  Circle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Planner:React.FC = () => {
  const [activeTab, setActiveTab] = useState("today");

  const studySessions = [
    {
      id: 1,
      subject: "Mathematics",
      topic: "Calculus - Derivatives",
      duration: "2 hours",
      date: "2024-01-15",
      time: "14:00 - 16:00",
      completed: false,
      priority: "high"
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Mechanics - Newton's Laws",
      duration: "1.5 hours",
      date: "2024-01-16",
      time: "10:00 - 11:30",
      completed: true,
      priority: "medium"
    },
    {
      id: 3,
      subject: "Computer Science",
      topic: "Data Structures - Arrays",
      duration: "2 hours",
      date: "2024-01-17",
      time: "15:00 - 17:00",
      completed: false,
      priority: "high"
    }
  ];

  const assignments = [
    {
      id: 1,
      title: "Math Problem Set 5",
      subject: "Mathematics",
      dueDate: "2024-01-20",
      priority: "high",
      completed: false
    },
    {
      id: 2,
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "2024-01-22",
      priority: "medium",
      completed: false
    },
    {
      id: 3,
      title: "CS Programming Assignment",
      subject: "Computer Science",
      dueDate: "2024-01-25",
      priority: "low",
      completed: true
    }
  ];

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Planner</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Plan your study sessions and track your academic progress
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        {["today", "week", "month", "assignments"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            className="flex-1 capitalize"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Study Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studySessions.map((session) => (
                <div key={session.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{session.subject}</h4>
                        <Badge className={getPriorityColor(session.priority)}>
                          {session.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {session.topic}
                      </p>
                      <div className="flex items-center mt-3 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.duration} • {session.time}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {session.date}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={session.completed ? "text-green-600" : "text-gray-400"}
                    >
                      {session.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{assignment.title}</h4>
                        <Badge className={getPriorityColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {assignment.subject}
                      </p>
                      <div className="flex items-center mt-3 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {assignment.dueDate}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={assignment.completed ? "text-green-600" : "text-gray-400"}
                    >
                      {assignment.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Study Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Mathematics", "Physics", "Computer Science"].map((subject) => (
              <div key={subject} className="text-center p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">{subject}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">8/12 hours completed</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Add */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Add</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input placeholder="Task title" />
            <Textarea placeholder="Description" />
            <div className="grid grid-cols-2 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" />
            </div>
            <Button className="w-full">Add to Planner</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Planner;