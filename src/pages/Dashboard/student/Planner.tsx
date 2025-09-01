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
} from "lucide-react";
import { assignmentService } from "@/services/assignmentService";
import { studySessionService } from "@/services/studySessionService";
import { studyGoalService } from "@/services/studyGoalService";
import { toast } from "sonner";
import type { Assignment, StudySession, StudyGoal } from "@/types/education";
import AddStudySessionDialog from "@/components/dashboard/student/AddStudySessionDialog";
import AddAssignmentDialog from "@/components/dashboard/student/AddAssignmentDialog";
import AddStudyGoalDialog from "@/components/dashboard/student/AddStudyGoalDialog";

const Planner: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("today");
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Fetch study sessions
  const {
    data: studySessions = [],
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery<StudySession[]>({
    queryKey: ["study-sessions"],
    queryFn: studySessionService.getStudySessions,
  });

  // Fetch assignments
  const {
    data: assignments = [],
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useQuery<Assignment[]>({
    queryKey: ["assignments"],
    queryFn: assignmentService.getAssignments,
  });

  // Fetch study goals
  const {
    data: studyGoals = [],
    isLoading: goalsLoading,
    error: goalsError,
  } = useQuery<StudyGoal[]>({
    queryKey: ["study-goals"],
    queryFn: studyGoalService.getStudyGoals,
  });

  // Toggle study session completion mutation
  const toggleSessionMutation = useMutation({
    mutationFn: studySessionService.toggleStudySessionCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["study-goals"] }); // Invalidate goals to update progress
      toast.success("Study session updated");
    },
    onError: () => {
      toast.error("Failed to update study session");
    },
  });

  // Toggle assignment completion mutation
  const toggleAssignmentMutation = useMutation({
    mutationFn: assignmentService.toggleAssignmentCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment updated");
    },
    onError: () => {
      toast.error("Failed to update assignment");
    },
  });

  // Delete study session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: studySessionService.deleteStudySession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["study-goals"] });
      toast.success("Study session deleted");
    },
    onError: () => {
      toast.error("Failed to delete study session");
    },
  });

  // Delete assignment mutation
  const deleteAssignmentMutation = useMutation({
    mutationFn: assignmentService.deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment deleted");
    },
    onError: () => {
      toast.error("Failed to delete assignment");
    },
  });

  // Filter sessions based on active tab
  const filterSessions = (sessions: StudySession[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Start of week (Monday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of week (Sunday)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    switch (activeTab) {
      case "today":
        return sessions.filter(
          (session) =>
            new Date(session.date).toDateString() === today.toDateString()
        );
      case "week":
        return sessions.filter((session) => {
          const sessionDate = new Date(session.date);
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        });
      case "month":
        return sessions.filter((session) => {
          const sessionDate = new Date(session.date);
          return sessionDate >= monthStart && sessionDate <= monthEnd;
        });
      default:
        return sessions;
    }
  };

  // Filter assignments based on active tab
  const filterAssignments = (assignments: Assignment[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    switch (activeTab) {
      case "today":
        return assignments.filter(
          (assignment) =>
            assignment.dueDate &&
            new Date(assignment.dueDate).toDateString() === today.toDateString()
        );
      case "week":
        return assignments.filter(
          (assignment) =>
            assignment.dueDate && new Date(assignment.dueDate) <= weekEnd
        );
      case "month":
        return assignments.filter(
          (assignment) =>
            assignment.dueDate && new Date(assignment.dueDate) <= monthEnd
        );
      case "assignments":
        return assignments;
      default:
        return assignments;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      medium:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return (
      colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const handleToggleSession = (id: string) => {
    toggleSessionMutation.mutate(id);
  };

  const handleToggleAssignment = (id: string) => {
    toggleAssignmentMutation.mutate(id);
  };

  const handleDeleteSession = (id: string) => {
    if (window.confirm("Are you sure you want to delete this study session?")) {
      deleteSessionMutation.mutate(id);
    }
  };

  const handleDeleteAssignment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignmentMutation.mutate(id);
    }
  };

  if (sessionsError || assignmentsError || goalsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Error loading planner data
          </h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const filteredSessions = filterSessions(studySessions);
  const filteredAssignments = filterAssignments(assignments);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Study Planner
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Plan your study sessions and track your academic progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAddGoal(true)}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Add Goal
          </Button>
          <Button
            onClick={() => setShowAddSession(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Session
          </Button>
        </div>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Study Sessions
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddSession(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg border animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No study sessions found</p>
                <Button variant="link" onClick={() => setShowAddSession(true)}>
                  Add your first study session
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div
                    key={session._id}
                    className="p-4 rounded-lg border group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{session.subject}</h4>
                          <Badge
                            className={getPriorityColor(
                              session.priority || "medium"
                            )}
                          >
                            {session.priority || "medium"}
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
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => handleDeleteSession(session._id!)}
                          disabled={deleteSessionMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={
                            session.completed
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                          onClick={() => handleToggleSession(session._id!)}
                          disabled={toggleSessionMutation.isPending}
                        >
                          {session.completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Assignments
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddAssignment(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {assignmentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg border animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No assignments found</p>
                <Button
                  variant="link"
                  onClick={() => setShowAddAssignment(true)}
                >
                  Add your first assignment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="p-4 rounded-lg border group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{assignment.title}</h4>
                          <Badge
                            className={getPriorityColor(assignment.priority)}
                          >
                            {assignment.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {assignment.subject}
                        </p>
                        <div className="flex items-center mt-3 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due:{" "}
                          {assignment.dueDate
                            ? new Date(assignment.dueDate).toLocaleDateString()
                            : "No due date"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => handleDeleteAssignment(assignment._id)}
                          disabled={deleteAssignmentMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={
                            assignment.completed
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                          onClick={() => handleToggleAssignment(assignment._id)}
                          disabled={toggleAssignmentMutation.isPending}
                        >
                          {assignment.completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Study Goals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Study Goals</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddGoal(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {goalsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="text-center p-4 rounded-lg border animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : studyGoals.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No study goals yet</p>
              <Button variant="link" onClick={() => setShowAddGoal(true)}>
                Create your first study goal
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {studyGoals.map((goal) => {
                const progress =
                  goal.completedHours && goal.targetHours
                    ? Math.min(
                        (goal.completedHours / goal.targetHours) * 100,
                        100
                      )
                    : 0;

                return (
                  <div
                    key={goal._id}
                    className="text-center p-4 rounded-lg border"
                  >
                    <h4 className="font-semibold mb-2">{goal.subject}</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {goal.completedHours?.toFixed(1) || 0}/{goal.targetHours}{" "}
                      hours
                      {goal.period && ` (${goal.period})`}
                    </p>
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
      />

      <AddAssignmentDialog
        open={showAddAssignment}
        onOpenChange={setShowAddAssignment}
      />

      <AddStudyGoalDialog open={showAddGoal} onOpenChange={setShowAddGoal} />
    </div>
  );
};

export default Planner;
