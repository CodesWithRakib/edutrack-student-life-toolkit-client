import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  BookOpen,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Tag,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ExamQA: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const subjects = [
    "Mathematics",
    "Physics",
    "Computer Science",
    "Chemistry",
    "Biology",
  ];

  const questions = [
    {
      id: 1,
      title: "How to solve differential equations?",
      subject: "Mathematics",
      content:
        "I'm having trouble understanding how to solve second-order differential equations. Can someone explain the steps?",
      answers: 5,
      votes: 12,
      views: 45,
      date: "2 hours ago",
      tags: ["calculus", "differential-equations"],
      solved: false,
    },
    {
      id: 2,
      title: "Newton's Third Law application",
      subject: "Physics",
      content: "Can someone give real-world examples of Newton's Third Law?",
      answers: 3,
      votes: 8,
      views: 32,
      date: "1 day ago",
      tags: ["mechanics", "newton-laws"],
      solved: true,
    },
    {
      id: 3,
      title: "Array vs Linked List performance",
      subject: "Computer Science",
      content:
        "When should I use arrays over linked lists in terms of performance?",
      answers: 7,
      votes: 15,
      views: 67,
      date: "3 days ago",
      tags: ["data-structures", "algorithms"],
      solved: true,
    },
  ];

  const popularTags = [
    { name: "calculus", count: 45 },
    { name: "mechanics", count: 32 },
    { name: "data-structures", count: 28 },
    { name: "organic-chemistry", count: 21 },
    { name: "thermodynamics", count: 18 },
    { name: "algorithms", count: 15 },
  ];

  const filteredQuestions = questions.filter(
    (q) =>
      (activeSubject === "all" || q.subject === activeSubject) &&
      (q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Exam Q&A
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ask questions and get help from the community
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowQuestionForm(!showQuestionForm)}
        >
          <Plus className="h-4 w-4" />
          Ask Question
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={activeSubject} onValueChange={setActiveSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ask Question Form */}
      {showQuestionForm && (
        <Card>
          <CardHeader>
            <CardTitle>Ask a New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Question title" />
              <Textarea
                placeholder="Describe your question in detail..."
                rows={4}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Add tags (comma separated)" />
              </div>
              <div className="flex gap-2">
                <Button>Post Question</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowQuestionForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card
            key={question.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Votes */}
                <div className="flex flex-col items-center w-12">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold text-sm">
                    {question.votes}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg hover:text-blue-600">
                      {question.title}
                    </h3>
                    {question.solved && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Solved
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {question.content}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {question.answers} answers
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {question.views} views
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{question.subject}</Badge>
                      <span>{question.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Badge
                key={tag.name}
                variant="secondary"
                className="px-3 py-1.5 cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-colors"
              >
                #{tag.name}
                <span className="ml-1 text-gray-500 text-xs">
                  ({tag.count})
                </span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Questions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,243</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Answers Posted
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,487</div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solved Questions
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">72% success rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamQA;
