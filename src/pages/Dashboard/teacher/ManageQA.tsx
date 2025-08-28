// src/pages/Dashboard/teacher/ManageQA.tsx
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
  MessageSquare,
  CheckCircle,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for Q&A
const questionsData = [
  {
    id: 1,
    question: "How do I solve quadratic equations?",
    student: "Sarah Johnson",
    subject: "Mathematics",
    date: "2023-10-15",
    status: "answered",
    answer: "You can use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a",
  },
  {
    id: 2,
    question: "What is the significance of the French Revolution?",
    student: "Michael Chen",
    subject: "History",
    date: "2023-10-14",
    status: "pending",
  },
  {
    id: 3,
    question: "How does photosynthesis work?",
    student: "Emma Williams",
    subject: "Science",
    date: "2023-10-13",
    status: "answered",
    answer:
      "Photosynthesis converts light energy into chemical energy in plants...",
  },
  {
    id: 4,
    question: "What are the main themes in Shakespeare's Macbeth?",
    student: "David Brown",
    subject: "English",
    date: "2023-10-12",
    status: "pending",
  },
];

const ManageQA = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredQuestions = questionsData.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && q.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Q&A</h2>
          <p className="text-muted-foreground">
            Answer student questions and manage inquiries
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New FAQ
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="answered">Answered</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search questions..."
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
                {activeTab === "all" && "All Questions"}
                {activeTab === "pending" && "Pending Questions"}
                {activeTab === "answered" && "Answered Questions"}
                {` (${filteredQuestions.length})`}
              </div>
              <div className="divide-y divide-border">
                {filteredQuestions.map((q) => (
                  <div key={q.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{q.subject}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Asked by {q.student} on {q.date}
                          </span>
                        </div>
                        <h3 className="font-medium mb-2">{q.question}</h3>
                        {q.status === "answered" && (
                          <div className="bg-muted p-4 rounded-lg mt-3">
                            <p className="text-sm">
                              <strong>Answer:</strong> {q.answer}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {q.status === "answered" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Answered
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              {q.status === "answered"
                                ? "Edit Answer"
                                : "Answer Question"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {q.status === "pending" && (
                      <div className="mt-4 flex gap-2">
                        <Input placeholder="Type your answer here..." />
                        <Button>Submit Answer</Button>
                      </div>
                    )}
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

export default ManageQA;
