// src/pages/Dashboard/teacher/Assignments.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Clock,
  BookOpen,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { Assignment } from "@/types/education";
import { useNavigate } from "react-router";

const Assignments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // Fetch assignments using TanStack Query
  const {
    data: assignments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => apiClient.get("/assignments").then((res) => res.data),
  });

  const filteredAssignments = assignments?.filter((assignment: Assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && assignment?.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Active
          </Badge>
        );
      case "graded":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Graded
          </Badge>
        );
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
          <p className="mt-4">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500">Error loading assignments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
          <p className="text-muted-foreground">
            Create and manage assignments for your students
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/teacher/create-assignment")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Assignments</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assignments..."
                className="pl-8 w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="border-b border-border px-6 py-4 font-medium">
                {activeTab === "all" && "All Assignments"}
                {activeTab === "active" && "Active Assignments"}
                {activeTab === "graded" && "Graded Assignments"}
                {activeTab === "draft" && "Draft Assignments"}
                {` (${filteredAssignments?.length || 0})`}
              </div>

              <div className="divide-y divide-border">
                {filteredAssignments?.map((assignment: Assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <BookOpen className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Badge variant="secondary">
                            {assignment.subject}
                          </Badge>
                          <div className="flex items-center gap-1 ml-2">
                            <Calendar className="h-3 w-3" />
                            Due {assignment.dueDate}
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <Clock className="h-3 w-3" />
                            {assignment.points} points
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {assignment.submissions} submissions
                        </div>
                        {getStatusBadge(assignment.status)}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Submissions
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download All
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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

export default Assignments;
