import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  studySessionService,
  type StudySessionFilters,
} from "@/services/studySessionService";
import {
  assignmentService,
  type AssignmentFilters,
} from "@/services/assignmentService";
import { studyGoalService } from "@/services/studyGoalService";

type PlannerTab = "today" | "week" | "month" | "assignments";

const Planner: React.FC = () => {
  const queryClient = useQueryClient();
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
  } = useQuery<StudySession[]>({
    queryKey: ["study-sessions", activeTab],
    queryFn: () => {
      const filters: StudySessionFilters = {};
      if (["today", "week", "month"].includes(activeTab)) {
        filters.period = activeTab;
      }
      return studySessionService.getStudySessions(filters);
    },
  });

  const {
    data: assignments = [],
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useQuery<Assignment[]>({
    queryKey: ["assignments", activeTab],
    queryFn: () => assignmentService.getAssignments({}),
  });

  const {
    data: studyGoals = [],
    isLoading: goalsLoading,
    error: goalsError,
  } = useQuery<StudyGoal[]>({
    queryKey: ["study-goals"],
    queryFn: () => studyGoalService.getStudyGoals({}),
  });

  // --- Helpers ---
  const getPriorityVariant = (
    priority?: Assignment["priority"] | StudySession["priority"]
  ): "default" | "destructive" | "success" | "warning" | "secondary" => {
    const variants: Record<
      string,
      "default" | "destructive" | "success" | "warning" | "secondary"
    > = {
      high: "destructive",
      medium: "warning",
      low: "success",
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

  // --- Mutations with optimistic updates ---
  const toggleSessionMutation = useMutation<
    StudySession,
    Error,
    string,
    { previous?: StudySession[] }
  >({
    mutationFn: studySessionService.toggleStudySessionCompletion,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["study-sessions"] });
      const previous = queryClient.getQueryData<StudySession[]>([
        "study-sessions",
      ]);
      queryClient.setQueryData<StudySession[]>(["study-sessions"], (old = []) =>
        old.map((s) => (s._id === id ? { ...s, completed: !s.completed } : s))
      );
      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous)
        queryClient.setQueryData(["study-sessions"], context.previous);
      toast.error("Failed to update study session", {
        description: error.message,
      });
    },
    onSuccess: () => toast.success("Study session updated"),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["study-goals"] }),
  });

  const toggleAssignmentMutation = useMutation<
    Assignment,
    Error,
    string,
    { previous?: Assignment[] }
  >({
    mutationFn: assignmentService.toggleAssignmentCompletion,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["assignments"] });
      const previous = queryClient.getQueryData<Assignment[]>(["assignments"]);
      queryClient.setQueryData<Assignment[]>(["assignments"], (old = []) =>
        old.map((a) => (a._id === id ? { ...a, completed: !a.completed } : a))
      );
      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous)
        queryClient.setQueryData(["assignments"], context.previous);
      toast.error("Failed to update assignment", {
        description: error.message,
      });
    },
    onSuccess: () => toast.success("Assignment updated"),
  });

  const deleteSessionMutation = useMutation<
    StudySession,
    Error,
    string,
    { previous?: StudySession[] }
  >({
    mutationFn: studySessionService.deleteStudySession,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["study-sessions"] });
      const previous = queryClient.getQueryData<StudySession[]>([
        "study-sessions",
      ]);
      queryClient.setQueryData<StudySession[]>(["study-sessions"], (old = []) =>
        old.filter((s) => s._id !== id)
      );
      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous)
        queryClient.setQueryData(["study-sessions"], context.previous);
      toast.error("Failed to delete study session", {
        description: error.message,
      });
    },
    onSuccess: () => toast.success("Study session deleted"),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["study-goals"] }),
  });

  const deleteAssignmentMutation = useMutation<
    Assignment,
    Error,
    string,
    { previous?: Assignment[] }
  >({
    mutationFn: assignmentService.deleteAssignment,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["assignments"] });
      const previous = queryClient.getQueryData<Assignment[]>(["assignments"]);
      queryClient.setQueryData<Assignment[]>(["assignments"], (old = []) =>
        old.filter((a) => a._id !== id)
      );
      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous)
        queryClient.setQueryData(["assignments"], context.previous);
      toast.error("Failed to delete assignment", {
        description: error.message,
      });
    },
    onSuccess: () => toast.success("Assignment deleted"),
  });

  const deleteGoalMutation = useMutation<
    StudyGoal,
    Error,
    string,
    { previous?: StudyGoal[] }
  >({
    mutationFn: studyGoalService.deleteStudyGoal,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["study-goals"] });
      const previous = queryClient.getQueryData<StudyGoal[]>(["study-goals"]);
      queryClient.setQueryData<StudyGoal[]>(["study-goals"], (old = []) =>
        old.filter((g) => g._id !== id)
      );
      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous)
        queryClient.setQueryData(["study-goals"], context.previous);
      toast.error("Failed to delete study goal", {
        description: error.message,
      });
    },
    onSuccess: () => toast.success("Study goal deleted"),
  });

  // --- Handlers ---
  const handleToggleSession = (id?: string) => {
    if (id) toggleSessionMutation.mutate(id);
  };
  const handleToggleAssignment = (id?: string) => {
    if (id) toggleAssignmentMutation.mutate(id);
  };
  const handleDeleteSession = (id?: string) => {
    if (id && confirm("Delete this session?")) deleteSessionMutation.mutate(id);
  };
  const handleDeleteAssignment = (id?: string) => {
    if (id && confirm("Delete this assignment?"))
      deleteAssignmentMutation.mutate(id);
  };
  const handleDeleteGoal = (id?: string) => {
    if (id && confirm("Delete this goal?")) deleteGoalMutation.mutate(id);
  };

  const filteredAssignments = filterAssignments(assignments);

  if (sessionsError || assignmentsError || goalsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert variant="destructive" className="max-w-md">
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
          <h1 className="text-3xl font-bold text-foreground">Study Planner</h1>
          <p className="text-muted-foreground mt-2">
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
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" /> Add Goal
          </Button>
          <Button
            onClick={() => {
              setShowAddSession(true);
              setEditSession(null);
            }}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Session
          </Button>
          <Button
            onClick={() => {
              setShowAddAssignment(true);
              setEditAssignment(null);
            }}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="assignments">All Assignments</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Sessions & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Sessions Card */}
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row justify-between items-center pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-blue-500" /> Study Sessions
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddSession(true);
                setEditSession(null);
              }}
              className="h-8 w-8 p-0 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessionsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg border border-muted">
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
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                <BookOpen className="h-10 w-10 opacity-30 mb-2" />
                <p>No study sessions found</p>
                <Button
                  variant="link"
                  className="mt-2"
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
                  className={`p-4 rounded-lg border transition-all hover:shadow-sm group ${
                    s.completed ? "bg-muted/30 opacity-80" : "bg-card"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2 items-center flex-wrap">
                        <h4
                          className={`font-semibold ${
                            s.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {s.subject}
                        </h4>
                        <Badge
                          variant={
                            getPriorityVariant(s.priority) as
                              | "default"
                              | "destructive"
                              | "success"
                              | "warning"
                              | "secondary"
                          }
                          className="text-xs"
                        >
                          {s.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{s.topic}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
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
                        className="h-7 w-7"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${
                          s.completed
                            ? "text-green-600 hover:text-green-700"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => handleToggleSession(s._id!)}
                        disabled={toggleSessionMutation.isLoading}
                      >
                        {toggleSessionMutation.isLoading &&
                        s._id === toggleSessionMutation.variables ? (
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
                        className="h-7 w-7 text-destructive hover:text-destructive/90"
                        onClick={() => handleDeleteSession(s._id!)}
                        disabled={deleteSessionMutation.isLoading}
                      >
                        {deleteSessionMutation.isLoading &&
                        s._id === deleteSessionMutation.variables ? (
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
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row justify-between items-center pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-amber-500" /> Assignments
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddAssignment(true);
                setEditAssignment(null);
              }}
              className="h-8 w-8 p-0 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignmentsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg border border-muted">
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
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                <Target className="h-10 w-10 opacity-30 mb-2" />
                <p>No assignments found</p>
                <Button
                  variant="link"
                  className="mt-2"
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
                  className={`p-4 rounded-lg border transition-all hover:shadow-sm group ${
                    a.completed ? "bg-muted/30 opacity-80" : "bg-card"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2 items-center flex-wrap">
                        <h4
                          className={`font-semibold ${
                            a.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {a.title}
                        </h4>
                        <Badge
                          variant={
                            getPriorityVariant(a.priority) as
                              | "default"
                              | "destructive"
                              | "success"
                              | "warning"
                              | "secondary"
                          }
                          className="text-xs"
                        >
                          {a.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {a.subject}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
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
                        className="h-7 w-7"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${
                          a.completed
                            ? "text-green-600 hover:text-green-700"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => handleToggleAssignment(a._id!)}
                        disabled={toggleAssignmentMutation.isLoading}
                      >
                        {toggleAssignmentMutation.isLoading &&
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
                        className="h-7 w-7 text-destructive hover:text-destructive/90"
                        onClick={() => handleDeleteAssignment(a._id!)}
                        disabled={deleteAssignmentMutation.isLoading}
                      >
                        {deleteAssignmentMutation.isLoading &&
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
      <Card className="shadow-sm border-muted">
        <CardHeader className="flex flex-row justify-between items-center pb-3">
          <CardTitle className="text-lg">Study Goals</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowAddGoal(true);
              setEditGoal(null);
            }}
            className="h-8 w-8 p-0 rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {goalsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="text-center p-4 rounded-lg border border-muted"
                >
                  <Skeleton className="h-5 w-3/4 mx-auto mb-3" />
                  <Skeleton className="h-2 w-full mb-2 rounded-full" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : studyGoals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
              <Target className="h-10 w-10 opacity-30 mb-2" />
              <p>No study goals yet</p>
              <Button
                variant="link"
                className="mt-2"
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
                    className="text-center p-4 rounded-lg border border-muted transition-all hover:shadow-sm group"
                  >
                    <h4 className="font-semibold mb-3 text-foreground">
                      {g.subject}
                    </h4>
                    <div className="w-full bg-muted rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          progressVariant === "success"
                            ? "bg-green-500"
                            : progressVariant === "default"
                            ? "bg-blue-500"
                            : progressVariant === "warning"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
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
                        className="h-7 w-7"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive/90"
                        onClick={() => handleDeleteGoal(g._id!)}
                        disabled={deleteGoalMutation.isLoading}
                      >
                        {deleteGoalMutation.isLoading &&
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
      />
      <AddAssignmentDialog
        open={showAddAssignment}
        onOpenChange={setShowAddAssignment}
        editAssignment={editAssignment}
        onClose={() => setEditAssignment(null)}
      />
      <AddStudyGoalDialog
        open={showAddGoal}
        onOpenChange={setShowAddGoal}
        editGoal={editGoal}
        onClose={() => setEditGoal(null)}
      />
    </div>
  );
};

export default Planner;
