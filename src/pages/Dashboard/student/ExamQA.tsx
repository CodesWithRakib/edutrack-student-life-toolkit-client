import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Tag,
  Loader2,
  X,
  CheckCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Question, PopularTag } from "@/types/question";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useQuestions,
  usePopularTags,
  useQuestionStats,
  useCreateQuestion,
  useVoteQuestion,
} from "@/hooks/useQuestions";

const ExamQA: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    subject: "",
    tags: [] as string[],
    tagInput: "",
  });

  // Fetch questions with filtering
  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
  } = useQuestions({
    subject: activeSubject !== "all" ? activeSubject : undefined,
    search: searchQuery || undefined,
    sort: sortBy as "newest" | "most-voted" | "most-viewed",
  });

  // Fetch popular tags
  const { data: popularTags } = usePopularTags();

  // Fetch statistics
  const { data: stats } = useQuestionStats();

  // Create question mutation
  const createQuestionMutation = useCreateQuestion();

  // Vote on question mutation
  const voteQuestionMutation = useVoteQuestion();

  const subjects = [
    "Mathematics",
    "Physics",
    "Computer Science",
    "Chemistry",
    "Biology",
  ];
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "most-voted", label: "Most Voted" },
    { value: "most-viewed", label: "Most Viewed" },
  ];

  const handleCreateQuestion = () => {
    if (!newQuestion.title || !newQuestion.content || !newQuestion.subject) {
      toast.error("Please fill in all required fields");
      return;
    }
    createQuestionMutation.mutate({
      title: newQuestion.title,
      content: newQuestion.content,
      subject: newQuestion.subject,
      tags: newQuestion.tags,
    });
  };

  const handleVote = (questionId: string, type: "up" | "down") => {
    voteQuestionMutation.mutate({ id: questionId, type });
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newQuestion.tagInput.trim()) {
      e.preventDefault();
      const newTag = newQuestion.tagInput.trim();
      if (!newQuestion.tags.includes(newTag)) {
        setNewQuestion((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
          tagInput: "",
        }));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewQuestion((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleRefresh = () => {
    // The hooks will automatically refetch when the component re-renders
    // This is just to trigger a manual refresh if needed
    window.location.reload();
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
              Exam Q&A
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Ask questions and get help from the community
            </p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  className="shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh questions</TooltipContent>
            </Tooltip>
            <Button
              onClick={() => setShowQuestionForm(true)}
              className="shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </div>
        </div>
        {/* Search and Filter */}
        <Card className="shadow-sm border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search questions..."
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={activeSubject} onValueChange={setActiveSubject}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {/* Ask Question Form */}
        {showQuestionForm && (
          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Ask a New Question
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQuestionForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <Input
                  placeholder="Question title"
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newQuestion.title}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Describe your question in detail..."
                  rows={4}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newQuestion.content}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, content: e.target.value })
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    value={newQuestion.subject}
                    onValueChange={(value) =>
                      setNewQuestion({ ...newQuestion, subject: value })
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Add tags (press Enter to add)"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    value={newQuestion.tagInput}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        tagInput: e.target.value,
                      })
                    }
                    onKeyDown={handleTagInput}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {newQuestion.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateQuestion}
                    disabled={createQuestionMutation.isPending}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {createQuestionMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Post Question
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowQuestionForm(false)}
                    className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
          {questionsLoading && (
            <>
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="shadow-sm border-0 bg-white dark:bg-gray-800"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center w-12 space-y-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-4 w-6" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
          {questionsError && (
            <div className="text-center py-8">
              <Card className="max-w-md mx-auto shadow-sm border-0 bg-white dark:bg-gray-800">
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
                  <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                    Error loading questions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please try again later
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-gray-200 dark:border-gray-600"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          {questionsData?.questions && questionsData.questions.length === 0 && (
            <Card className="text-center py-12 shadow-sm border-0 bg-white dark:bg-gray-800">
              <CardContent>
                <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No questions found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "Be the first to ask a question!"}
                </p>
                <Button
                  onClick={() => setShowQuestionForm(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Ask a Question
                </Button>
              </CardContent>
            </Card>
          )}
          {questionsData?.questions && questionsData.questions.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {questionsData.total} question
                  {questionsData.total !== 1 ? "s" : ""} found
                </div>
                <Badge
                  variant="outline"
                  className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700"
                >
                  {questionsData.total} questions
                </Badge>
              </div>
              {questionsData.questions.map((question: Question) => (
                <Card
                  key={question._id}
                  className="shadow-sm border-0 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Votes */}
                      <div className="flex flex-col items-center w-12">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={() => handleVote(question._id, "up")}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Upvote</TooltipContent>
                        </Tooltip>
                        <span className="font-semibold text-sm my-1 text-gray-700 dark:text-gray-300">
                          {question.votes}
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleVote(question._id, "down")}
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Downvote</TooltipContent>
                        </Tooltip>
                      </div>
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {question.title}
                          </h3>
                          {question.solved && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Solved
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {question.content}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {question.tags?.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {question.answersCount} answers
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {question.views} views
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                            >
                              {question.subject}
                            </Badge>
                            <span className="text-gray-500 dark:text-gray-400">
                              {new Date(
                                question.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
        {/* Popular Tags */}
        <Card className="shadow-sm border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Tag className="h-5 w-5" />
              Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3">
              {popularTags?.map((tag: PopularTag) => (
                <Badge
                  key={tag.name}
                  variant="secondary"
                  className="px-3 py-1.5 cursor-pointer bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  #{tag.name}
                  <span className="ml-1 text-indigo-600 dark:text-indigo-400 text-xs">
                    ({tag.count})
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/80 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Total Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalQuestions || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800/80 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Answers Posted
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalAnswers || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-gray-800 dark:to-gray-800/80 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Solved Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.solvedQuestions || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ExamQA;
