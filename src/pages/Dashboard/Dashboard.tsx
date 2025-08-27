import React from "react";
import { Link } from "react-router";
import {
  Calendar,
  DollarSign,
  BookOpen,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  const features = [
    {
      title: "Class Schedule",
      description: "Manage your class schedule with color coding",
      icon: Calendar,
      href: "/dashboard/schedule",
      color: "text-blue-600",
    },
    {
      title: "Budget Tracker",
      description: "Track your income and expenses",
      icon: DollarSign,
      href: "/dashboard/budget",
      color: "text-green-600",
    },
    {
      title: "Study Planner",
      description: "Plan your study sessions effectively",
      icon: BookOpen,
      href: "/dashboard/planner",
      color: "text-purple-600",
    },
    {
      title: "Exam Generator",
      description: "Generate practice questions for exams",
      icon: ClipboardList,
      href: "/dashboard/exam",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your student life toolkit</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Link key={feature.title} to={feature.href}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {feature.title}
                </CardTitle>
                <feature.icon className={`h-4 w-4 ${feature.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your recent activities will appear here.
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">Classes scheduled: 0</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">Total budget: $0.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
