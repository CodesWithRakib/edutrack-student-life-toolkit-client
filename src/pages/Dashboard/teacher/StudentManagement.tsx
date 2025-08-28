// src/pages/Dashboard/teacher/StudentManagement.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Mail,
  MoreVertical,
  User,
  BookOpen,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for students
const studentsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    grade: "10th Grade",
    enrolled: "2023-09-01",
    attendance: "95%",
    performance: "Excellent",
    subjects: ["Mathematics", "Science"],
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@example.com",
    grade: "10th Grade",
    enrolled: "2023-09-01",
    attendance: "88%",
    performance: "Good",
    subjects: ["Mathematics", "History"],
  },
  {
    id: 3,
    name: "Emma Williams",
    email: "emma.w@example.com",
    grade: "11th Grade",
    enrolled: "2023-09-01",
    attendance: "92%",
    performance: "Excellent",
    subjects: ["Science", "English"],
  },
  {
    id: 4,
    name: "David Brown",
    email: "david.b@example.com",
    grade: "11th Grade",
    enrolled: "2023-09-01",
    attendance: "78%",
    performance: "Needs Improvement",
    subjects: ["History", "English"],
  },
];

const StudentManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = studentsData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Good":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Needs Improvement":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Student Management
          </h2>
          <p className="text-muted-foreground">
            Manage your students, track progress, and communicate
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
            <TabsTrigger value="science">Science</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="english">English</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
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

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Roster</CardTitle>
              <CardDescription>
                {filteredStudents.length} students in your classes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b border-border px-6 py-4 font-medium">
                All Students ({filteredStudents.length})
              </div>
              <div className="divide-y divide-border">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-muted">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {student.email}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {student.grade}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Enrolled {student.enrolled}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {student.subjects.map((subject, index) => (
                            <Badge key={index} variant="secondary">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {student.attendance} attendance
                        </div>
                        <Badge
                          className={getPerformanceColor(student.performance)}
                        >
                          {student.performance}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="h-4 w-4 mr-2" />
                            View Profile
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

export default StudentManagement;
