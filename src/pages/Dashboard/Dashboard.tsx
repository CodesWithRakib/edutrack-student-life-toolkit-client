import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  BookOpen,
  BarChart3,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const quickActions = [
    {
      title: "View Schedule",
      description: "Check your class timetable",
      icon: Calendar,
      path: "/dashboard/schedule",
      color: "text-blue-600",
    },
    {
      title: "Budget Tracker",
      description: "Manage your expenses",
      icon: DollarSign,
      path: "/dashboard/budget",
      color: "text-green-600",
    },
    {
      title: "Study Planner",
      description: "Plan your study sessions",
      icon: BookOpen,
      path: "/dashboard/planner",
      color: "text-purple-600",
    },
    {
      title: "Performance",
      description: "View your progress",
      icon: BarChart3,
      path: "/dashboard/performance",
      color: "text-amber-600",
    },
  ];

  const stats = [
    { label: "Classes Today", value: "3", icon: Clock },
    { label: "Upcoming Exams", value: "2", icon: Calendar },
    { label: "Study Hours", value: "12h", icon: Clock },
    { label: "Progress", value: "78%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.displayName || "Student"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's what's happening with your education today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800`}
                    >
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">Completed Math Assignment</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Physics class added to schedule</p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
