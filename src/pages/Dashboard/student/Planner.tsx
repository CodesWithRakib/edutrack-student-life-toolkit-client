import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { Assignment, StudySession, StudyGoal } from "@/types/education";
import AddStudySessionDialog from "@/components/dashboard/student/AddStudySessionDialog";
import AddAssignmentDialog from "@/components/dashboard/student/AddAssignmentDialog";
import AddStudyGoalDialog from "@/components/dashboard/student/AddStudyGoalDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useStudySessions,
  useDeleteStudySession,
  useToggleStudySession,
} from "@/hooks/useStudySessions";
import {
  useAssignments,
  useDeleteAssignment,
  useToggleAssignment,
} from "@/hooks/useAssignments";
import { useStudyGoals, useDeleteStudyGoal } from "@/hooks/useStudyGoals";

// Initialize SweetAlert2 with React content
const MySwal = withReactContent(Swal);

type PlannerTab = "today" | "week" | "month" | "assignments";

const Planner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlannerTab>("today");
  const [showAddSession, setShowAddSession] = useState(false);
  const [editSession, setEditSession] = useState<StudySession | null>(null);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editGoal, setEditGoal] = useState<StudyGoal | null>(null);

  // --- Fetch Queries with filters ---
  const {
    data: studySessions = [],
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useStudySessions({
    period: activeTab as "today" | "week" | "month",
  });

  const {
    data: assignments = [],
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useAssignments();

  const {
    data: studyGoals = [],
    isLoading: goalsLoading,
    error: goalsError,
  } = useStudyGoals();

  // --- Mutations ---
  const toggleSessionMutation = useToggleStudySession();
  const deleteSessionMutation = useDeleteStudySession();
  const toggleAssignmentMutation = useToggleAssignment();
  const deleteAssignmentMutation = useDeleteAssignment();
  const deleteGoalMutation = useDeleteStudyGoal();

  // --- Helpers ---
  const getPriorityVariant = (
    priority?: Assignment["priority"] | StudySession["priority"]
  ): "default" | "destructive" | "secondary" => {
    const variants: Record<string, "default" | "destructive" | "secondary"> = {
      high: "destructive",
      medium: "secondary",
      low: "default",
    };
    return priority ? variants[priority] || "secondary" : "secondary";
  };

  const filterAssignments = (assignments: Assignment[]): Assignment[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return assignments.filter((a) => {
      if (!a.dueDate) return activeTab === "assignments";
      const due = new Date(a.dueDate);
      switch (activeTab) {
        case "today":
          return due.toDateString() === today.toDateString();
        case "week":
          return due <= weekEnd;
        case "month":
          return due <= monthEnd;
        case "assignments":
          return true;
        default:
          return true;
      }
    });
  };

  // --- Handlers with SweetAlert2 confirmation ---
  const handleToggleSession = (id?: string) => {
    if (id) toggleSessionMutation.mutate(id);
  };

  const handleToggleAssignment = (id?: string) => {
    if (id) toggleAssignmentMutation.mutate(id);
  };

  const handleDeleteSession = async (id?: string) => {
    if (!id) return;

    const result = await MySwal.fire({
      title: "Delete Study Session?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        container: "z-[9999]", // Ensure it's above other modals
      },
    });

    if (result.isConfirmed) {
      deleteSessionMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Study session deleted successfully");
          MySwal.fire(
            "Deleted!",
            "Your study session has been deleted.",
            "success"
          );
        },
        onError: () => {
          toast.error("Failed to delete study session");
          MySwal.fire("Error!", "Failed to delete study session.", "error");
        },
      });
    }
  };

  const handleDeleteAssignment = async (id?: string) => {
    if (!id) return;

    const result = await MySwal.fire({
      title: "Delete Assignment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        container: "z-[9999]", // Ensure it's above other modals
      },
    });

    if (result.isConfirmed) {
      deleteAssignmentMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Assignment deleted successfully");
          MySwal.fire(
            "Deleted!",
            "Your assignment has been deleted.",
            "success"
          );
        },
        onError: () => {
          toast.error("Failed to delete assignment");
          MySwal.fire("Error!", "Failed to delete assignment.", "error");
        },
      });
    }
  };

  const handleDeleteGoal = async (id?: string) => {
    if (!id) return;

    const result = await MySwal.fire({
      title: "Delete Study Goal?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        container: "z-[9999]", // Ensure it's above other modals
      },
    });

    if (result.isConfirmed) {
      deleteGoalMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Study goal deleted successfully");
          MySwal.fire(
            "Deleted!",
            "Your study goal has been deleted.",
            "success"
          );
        },
        onError: () => {
          toast.error("Failed to delete study goal");
          MySwal.fire("Error!", "Failed to delete study goal.", "error");
        },
      });
    }
  };

  // --- Success handlers for dialogs ---
  const handleAddSessionSuccess = () => {
    setShowAddSession(false);
    setEditSession(null);
    toast.success("Study session added successfully");
  };

  const handleEditSessionSuccess = () => {
    setShowAddSession(false);
    setEditSession(null);
    toast.success("Study session updated successfully");
  };

  const handleAddAssignmentSuccess = () => {
    setShowAddAssignment(false);
    setEditAssignment(null);
    toast.success("Assignment added successfully");
  };

  const handleEditAssignmentSuccess = () => {
    setShowAddAssignment(false);
    setEditAssignment(null);
    toast.success("Assignment updated successfully");
  };

  const handleAddGoalSuccess = () => {
    setShowAddGoal(false);
    setEditGoal(null);
    toast.success("Study goal added successfully");
  };

  const handleEditGoalSuccess = () => {
    setShowAddGoal(false);
    setEditGoal(null);
    toast.success("Study goal updated successfully");
  };

  const filteredAssignments = filterAssignments(assignments);

  if (sessionsError || assignmentsError || goalsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert variant="destructive" className="max-w-md shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load planner data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Study Planner
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Plan your study sessions and track your academic progress
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowAddGoal(true);
              setEditGoal(null);
            }}
            className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 border-gray-200 dark:border-gray-700"
          >
            <Target className="h-4 w-4" /> Add Goal
          </Button>
          <Button
            onClick={() => {
              setShowAddSession(true);
              setEditSession(null);
            }}
            className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            <Plus className="h-4 w-4" /> Add Session
          </Button>
          <Button
            onClick={() => {
              setShowAddAssignment(true);
              setEditAssignment(null);
            }}
            className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            <Plus className="h-4 w-4" /> Add Assignment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as PlannerTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-sm">
          <TabsTrigger
            value="today"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 shadow-sm rounded-md transition-all"
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value="week"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 shadow-sm rounded-md transition-all"
          >
            This Week
          </TabsTrigger>
          <TabsTrigger
            value="month"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 shadow-sm rounded-md transition-all"
          >
            This Month
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 shadow-sm rounded-md transition-all"
          >
            All Assignments
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Sessions & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Sessions Card */}
        <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
            <div className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-400">
                <BookOpen className="h-5 w-5" /> Study Sessions
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddSession(true);
                  setEditSession(null);
                }}
                className="h-8 w-8 p-0 rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {sessionsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30 mb-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              ))
            ) : studySessions.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-500 flex flex-col items-center">
                <BookOpen className="h-16 w-16 opacity-30 mb-3" />
                <p className="text-lg">No study sessions found</p>
                <Button
                  variant="link"
                  className="mt-2 text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setShowAddSession(true);
                    setEditSession(null);
                  }}
                >
                  Add your first session
                </Button>
              </div>
            ) : (
              studySessions.map((s) => (
                <div
                  key={s._id}
                  className={`p-4 rounded-lg border border-gray-100 dark:border-gray-700/30 transition-all hover:shadow-sm group mb-4 ${
                    s.completed
                      ? "bg-gray-50 dark:bg-gray-700/30 opacity-80"
                      : "bg-white dark:bg-gray-700/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2 items-center flex-wrap">
                        <h4
                          className={`font-semibold ${
                            s.completed
                              ? "line-through text-gray-500 dark:text-gray-500"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {s.subject}
                        </h4>
                        <Badge
                          variant={
                            getPriorityVariant(s.priority) as
                              | "default"
                              | "destructive"
                              | "secondary"
                          }
                          className="text-xs"
                        >
                          {s.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {s.topic}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />{" "}
                          {s.durationMinutes} min
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {new Date(s.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {s.time && (
                          <span className="flex items-center">{s.time}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditSession(s);
                          setShowAddSession(true);
                        }}
                        className="h-7 w-7 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${
                          s.completed
                            ? "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => handleToggleSession(s._id!)}
                        disabled={toggleSessionMutation.isPending}
                      >
                        {toggleSessionMutation.isPending &&
                        s._id ===
                          (toggleSessionMutation.variables as string) ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : s.completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDeleteSession(s._id!)}
                        disabled={deleteSessionMutation.isPending}
                      >
                        {deleteSessionMutation.isPending &&
                        s._id ===
                          (deleteSessionMutation.variables as string) ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Assignments Card */}
        <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
            <div className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg text-amber-700 dark:text-amber-400">
                <Target className="h-5 w-5" /> Assignments
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddAssignment(true);
                  setEditAssignment(null);
                }}
                className="h-8 w-8 p-0 rounded-full text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {assignmentsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30 mb-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              ))
            ) : filteredAssignments.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-500 flex flex-col items-center">
                <Target className="h-16 w-16 opacity-30 mb-3" />
                <p className="text-lg">No assignments found</p>
                <Button
                  variant="link"
                  className="mt-2 text-amber-500 hover:text-amber-700"
                  onClick={() => {
                    setShowAddAssignment(true);
                    setEditAssignment(null);
                  }}
                >
                  Add your first assignment
                </Button>
              </div>
            ) : (
              filteredAssignments.map((a) => (
                <div
                  key={a._id}
                  className={`p-4 rounded-lg border border-gray-100 dark:border-gray-700/30 transition-all hover:shadow-sm group mb-4 ${
                    a.completed
                      ? "bg-gray-50 dark:bg-gray-700/30 opacity-80"
                      : "bg-white dark:bg-gray-700/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2 items-center flex-wrap">
                        <h4
                          className={`font-semibold ${
                            a.completed
                              ? "line-through text-gray-500 dark:text-gray-500"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {a.title}
                        </h4>
                        <Badge
                          variant={
                            getPriorityVariant(a.priority) as
                              | "default"
                              | "destructive"
                              | "secondary"
                          }
                          className="text-xs"
                        >
                          {a.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {a.subject}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Due:{" "}
                        {a.dueDate
                          ? new Date(a.dueDate).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })
                          : "No due date"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditAssignment(a);
                          setShowAddAssignment(true);
                        }}
                        className="h-7 w-7 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${
                          a.completed
                            ? "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => handleToggleAssignment(a._id!)}
                        disabled={toggleAssignmentMutation.isPending}
                      >
                        {toggleAssignmentMutation.isPending &&
                        a._id === toggleAssignmentMutation.variables ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : a.completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDeleteAssignment(a._id!)}
                        disabled={deleteAssignmentMutation.isPending}
                      >
                        {deleteAssignmentMutation.isPending &&
                        a._id === deleteAssignmentMutation.variables ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Study Goals */}
      <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
          <div className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-400">
              <Target className="h-5 w-5" /> Study Goals
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddGoal(true);
                setEditGoal(null);
              }}
              className="h-8 w-8 p-0 rounded-full text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {goalsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30"
                >
                  <Skeleton className="h-5 w-3/4 mx-auto mb-3" />
                  <Skeleton className="h-2 w-full mb-2 rounded-full" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : studyGoals.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-500 flex flex-col items-center">
              <Target className="h-16 w-16 opacity-30 mb-3" />
              <p className="text-lg">No study goals yet</p>
              <Button
                variant="link"
                className="mt-2 text-green-500 hover:text-green-700"
                onClick={() => {
                  setShowAddGoal(true);
                  setEditGoal(null);
                }}
              >
                Create your first goal
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studyGoals.map((g) => {
                const progress =
                  g.completedHours && g.targetHours
                    ? Math.min((g.completedHours / g.targetHours) * 100, 100)
                    : 0;
                const progressVariant =
                  progress >= 90
                    ? "success"
                    : progress >= 70
                    ? "default"
                    : progress >= 50
                    ? "warning"
                    : "destructive";
                return (
                  <div
                    key={g._id}
                    className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/30 transition-all hover:shadow-sm group"
                  >
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                      {g.subject}
                    </h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          progressVariant === "success"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : progressVariant === "default"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                            : progressVariant === "warning"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-red-500 to-rose-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {g.completedHours?.toFixed(1) || 0}/{g.targetHours} hours{" "}
                      {g.period && `(${g.period})`}
                    </p>
                    <div className="flex justify-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditGoal(g);
                          setShowAddGoal(true);
                        }}
                        className="h-7 w-7 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDeleteGoal(g._id!)}
                        disabled={deleteGoalMutation.isPending}
                      >
                        {deleteGoalMutation.isPending &&
                        g._id === deleteGoalMutation.variables ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddStudySessionDialog
        open={showAddSession}
        onOpenChange={setShowAddSession}
        editSession={editSession}
        onClose={() => setEditSession(null)}
        onSuccess={
          editSession ? handleEditSessionSuccess : handleAddSessionSuccess
        }
      />
      <AddAssignmentDialog
        open={showAddAssignment}
        onOpenChange={setShowAddAssignment}
        editAssignment={editAssignment}
        onClose={() => setEditAssignment(null)}
        onSuccess={
          editAssignment
            ? handleEditAssignmentSuccess
            : handleAddAssignmentSuccess
        }
      />
      <AddStudyGoalDialog
        open={showAddGoal}
        onOpenChange={setShowAddGoal}
        editGoal={editGoal}
        onClose={() => setEditGoal(null)}
        onSuccess={editGoal ? handleEditGoalSuccess : handleAddGoalSuccess}
      />
    </div>
  );
};

export default Planner;
