// src/pages/Dashboard/student/Performance.tsx

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  BookOpen,
  Clock,
  Target,
  Download,
  Calendar,
  Award,
  BarChart3,
} from "lucide-react";

// Mock data - will be replaced with backend data later
const gradeData = [
  { subject: "Mathematics", grade: 85, maxGrade: 100, trend: "up" },
  { subject: "Science", grade: 78, maxGrade: 100, trend: "down" },
  { subject: "History", grade: 92, maxGrade: 100, trend: "up" },
  { subject: "English", grade: 88, maxGrade: 100, trend: "stable" },
  { subject: "Art", grade: 95, maxGrade: 100, trend: "up" },
];

const weeklyProgressData = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 4.2 },
  { day: "Wed", hours: 2.8 },
  { day: "Thu", hours: 5.1 },
  { day: "Fri", hours: 3.2 },
  { day: "Sat", hours: 1.5 },
  { day: "Sun", hours: 2.0 },
];

const subjectDistributionData = [
  { name: "Mathematics", value: 25 },
  { name: "Science", value: 20 },
  { name: "History", value: 15 },
  { name: "English", value: 22 },
  { name: "Art", value: 18 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const assignmentData = [
  { name: "Math Quiz", grade: 92, date: "2023-10-15" },
  { name: "Science Report", grade: 85, date: "2023-10-18" },
  { name: "History Essay", grade: 78, date: "2023-10-20" },
  { name: "English Test", grade: 88, date: "2023-10-22" },
];

const Performance = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate overall average
  const overallAverage =
    gradeData.reduce((sum, item) => sum + item.grade, 0) / gradeData.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Performance Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track your academic progress and performance metrics
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="analytics">Study Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Average
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overallAverage.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  +2.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Study Hours This Week
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {weeklyProgressData
                    .reduce((sum, day) => sum + day.hours, 0)
                    .toFixed(1)}
                  h
                </div>
                <p className="text-xs text-muted-foreground">
                  +1.2h from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Assignments
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24/30</div>
                <Progress value={80} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Goals Achieved
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3/5</div>
                <p className="text-xs text-muted-foreground">
                  2 goals in progress
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Grade Overview</CardTitle>
                <CardDescription>
                  Your performance across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="grade" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Study Distribution</CardTitle>
                <CardDescription>Time spent per subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subjectDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {subjectDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Your latest graded work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignmentData.map((assignment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {assignment.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {assignment.date}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        assignment.grade >= 90
                          ? "default"
                          : assignment.grade >= 80
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        assignment.grade >= 90
                          ? "bg-green-500"
                          : assignment.grade >= 80
                          ? "bg-yellow-500"
                          : ""
                      }
                    >
                      {assignment.grade}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Grades</CardTitle>
              <CardDescription>
                Your current grades in all subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradeData.map((subject, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{subject.subject}</span>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">{subject.grade}%</span>
                        {subject.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : subject.trend === "down" ? (
                          <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                        ) : (
                          <BarChart3 className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                    <Progress value={subject.grade} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade History</CardTitle>
              <CardDescription>
                Your grade progression over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={assignmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="grade"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Study Pattern</CardTitle>
                <CardDescription>
                  Your study hours throughout the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Goals</CardTitle>
                <CardDescription>Your weekly study targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Total Study Hours</span>
                      <span className="font-bold">22.3/25h</span>
                    </div>
                    <Progress value={89.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Mathematics</span>
                      <span className="font-bold">5.5/6h</span>
                    </div>
                    <Progress value={91.6} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Science</span>
                      <span className="font-bold">4.2/5h</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Assignment Completion</span>
                      <span className="font-bold">8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Study Recommendations</CardTitle>
              <CardDescription>
                Personalized tips to improve your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold">Focus Area: Science</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your science scores have decreased by 5% compared to last
                    month. Consider spending more time reviewing chapters 4-6.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-semibold">Study Consistency</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your study patterns are inconsistent. Try to establish a
                    regular study schedule to improve retention.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="font-semibold">Upcoming Assessments</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have a mathematics test in 2 weeks. Start preparing now
                    to avoid last-minute cramming.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Target className="h-5 w-5 text-orange-500 mr-2" />
                    <h3 className="font-semibold">Goal Setting</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Set specific targets for each study session to increase
                    productivity and focus.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;
