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
  BarChart3,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type {
  GradesData,
  StudyAnalytics,
  StudyRecommendation,
} from "@/types/performance";
import type { Grade } from "@/types/education";

// Reusable Chart Components
const GradeBarChart = ({ data }: { data: GradesData["grades"] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="subject" />
      <YAxis domain={[0, 100]} />
      <Tooltip />
      <Legend />
      <Bar dataKey="grade" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

const WeeklyProgressChart = ({
  data,
}: {
  data: StudyAnalytics["weeklyProgressData"];
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="hours" fill="#00C49F" />
    </BarChart>
  </ResponsiveContainer>
);

const SubjectDistributionChart = ({
  data,
}: {
  data: StudyAnalytics["subjectDistributionData"];
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={
              ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"][index % 5]
            }
          />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

const GradeHistoryChart = ({ data }: { data: GradesData["gradeHistory"] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis domain={[0, 100]} />
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
);

const Performance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    data: overviewData,
    isLoading: overviewLoading,
    isError: overviewError,
  } = useQuery({
    queryKey: ["performance-overview"],
    queryFn: () =>
      apiClient.get("/performance/overview").then((res) => res.data),
  });
  const {
    data: gradesData,
    isLoading: gradesLoading,
    isError: gradesError,
  } = useQuery({
    queryKey: ["performance-grades"],
    queryFn: () => apiClient.get("/performance/grades").then((res) => res.data),
  });
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useQuery({
    queryKey: ["performance-analytics"],
    queryFn: () =>
      apiClient.get("/performance/analytics").then((res) => res.data),
  });
  const {
    data: recommendationsData,
    isLoading: recommendationsLoading,
    isError: recommendationsError,
  } = useQuery({
    queryKey: ["performance-recommendations"],
    queryFn: () =>
      apiClient.get("/performance/recommendations").then((res) => res.data),
  });

  // Helper function for consistent number formatting
  const formatNumber = (num: number): string => num.toFixed(1);

  // Handle loading and error states
  if (
    overviewLoading ||
    gradesLoading ||
    analyticsLoading ||
    recommendationsLoading
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  if (overviewError || gradesError || analyticsError || recommendationsError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading data
      </div>
    );
  }

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
                  {overviewData?.overallAverage &&
                    formatNumber(overviewData.overallAverage)}
                  %
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
                  {overviewData?.weeklyHours &&
                    formatNumber(overviewData.weeklyHours)}
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
                <div className="text-2xl font-bold">
                  {overviewData?.completedAssignments}
                </div>
                <Progress
                  value={overviewData?.completionRate}
                  className="h-2 mt-2"
                />
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
                <div className="text-2xl font-bold">
                  {overviewData?.achievedGoals}
                </div>
                <p className="text-xs text-muted-foreground">
                  {overviewData?.goalsProgress > 0
                    ? `${overviewData.goalsProgress}% complete`
                    : "No goals set"}
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
                <GradeBarChart data={gradesData?.grades || []} />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Study Distribution</CardTitle>
                <CardDescription>Time spent per subject</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectDistributionChart
                  data={analyticsData?.subjectDistributionData || []}
                />
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
                {(gradesData?.gradeHistory || []).map((assignment: Grade) => (
                  <div
                    key={assignment._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {assignment.user}
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
                {(gradesData?.grades || []).map((subject: Grade) => (
                  <div key={subject._id}>
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
              <GradeHistoryChart data={gradesData?.gradeHistory || []} />
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
                <WeeklyProgressChart
                  data={analyticsData?.weeklyProgressData || []}
                />
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
                      <span className="font-bold">
                        {analyticsData?.goals?.targetHours || 0}/
                        {analyticsData?.goals?.targetHours || 0}h
                      </span>
                    </div>
                    <Progress
                      value={
                        ((analyticsData?.goals?.completedHours || 0) /
                          (analyticsData?.goals?.targetHours || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  {/* Additional goal cards would go here */}
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
                {recommendationsData?.map((rec: StudyRecommendation) => (
                  <div key={rec.title} className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <i
                        className={`${rec.icon} h-5 w-5 text-blue-500 mr-2`}
                      ></i>
                      <h3 className="font-semibold">{rec.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;
