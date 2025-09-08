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
  CheckCircle,
  Calendar,
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
      <Bar dataKey="grade" fill="#4f46e5" />
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
      <Bar dataKey="hours" fill="#10b981" />
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
              ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]
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
        stroke="#4f46e5"
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
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading performance data...
          </p>
        </div>
      </div>
    );
  }

  if (overviewError || gradesError || analyticsError || recommendationsError) {
    return (
      <div className="flex justify-center items-center h-64">
        <Card className="max-w-md shadow-sm">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Error loading data
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again later
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Performance Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your academic progress and performance metrics
          </p>
        </div>
        <Button className="shadow-sm hover:shadow-md transition-shadow">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-indigo-100 dark:bg-indigo-900/30"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="grades"
            className="data-[state=active]:bg-indigo-100 dark:bg-indigo-900/30"
          >
            Grades
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-indigo-100 dark:bg-indigo-900/30"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm border-0 overflow-hidden">
              <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20 pb-2">
                <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-400 flex items-center justify-between">
                  <span>Overall Average</span>
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overviewData?.overallAverage &&
                    formatNumber(overviewData.overallAverage)}
                  %
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +2.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 overflow-hidden">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                  <span>Study Hours This Week</span>
                  <Clock className="h-4 w-4 text-emerald-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overviewData?.weeklyHours &&
                    formatNumber(overviewData.weeklyHours)}
                  h
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +1.2h from last week
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 overflow-hidden">
              <CardHeader className="bg-amber-50 dark:bg-amber-900/20 pb-2">
                <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center justify-between">
                  <span>Completed Assignments</span>
                  <BookOpen className="h-4 w-4 text-amber-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overviewData?.completedAssignments}
                </div>
                <Progress
                  value={overviewData?.completionRate}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 overflow-hidden">
              <CardHeader className="bg-purple-50 dark:bg-purple-900/20 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center justify-between">
                  <span>Goals Achieved</span>
                  <Target className="h-4 w-4 text-purple-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overviewData?.achievedGoals}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {overviewData?.goalsProgress > 0
                    ? `${overviewData.goalsProgress}% complete`
                    : "No goals set"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="shadow-sm border-0 col-span-4">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Grade Overview
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your performance across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <GradeBarChart data={gradesData?.grades || []} />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 col-span-3">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Study Distribution
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Time spent per subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectDistributionChart
                  data={analyticsData?.subjectDistributionData || []}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Assignments
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Your latest graded work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(gradesData?.gradeHistory || []).map((assignment: Grade) => (
                  <div
                    key={assignment._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                          {assignment.user}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
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
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : assignment.grade >= 80
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
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
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Subject Grades
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Your current grades in all subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(gradesData?.grades || []).map((subject: Grade) => (
                  <div key={subject._id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {subject.subject}
                      </span>
                      <div className="flex items-center">
                        <span className="font-bold mr-2 text-gray-900 dark:text-white">
                          {subject.grade}%
                        </span>
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

          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Grade History
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
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
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Study Pattern
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your study hours throughout the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WeeklyProgressChart
                  data={analyticsData?.weeklyProgressData || []}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Study Goals
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your weekly study targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Total Study Hours
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {analyticsData?.goals?.completedHours || 0}/
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
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Study Recommendations
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Personalized tips to improve your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {recommendationsData?.map((rec: StudyRecommendation) => (
                  <div
                    key={rec.title}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center mb-2">
                      <div
                        className={`${rec.icon} h-5 w-5 text-indigo-500 mr-2`}
                      ></div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {rec.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
