import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { questionService } from "@/services/questionService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { Question, PopularTag } from "@/types/question";

const ExamQA: React.FC = () => {
  const queryClient = useQueryClient();
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
  } = useQuery({
    queryKey: ["questions", { activeSubject, searchQuery, sortBy }],
    queryFn: () =>
      questionService.getQuestions({
        subject: activeSubject !== "all" ? activeSubject : undefined,
        search: searchQuery || undefined,
        sort: sortBy as "newest" | "most-voted" | "most-viewed",
      }),
  });

  // Fetch popular tags
  const { data: popularTags } = useQuery({
    queryKey: ["popularTags"],
    queryFn: () => questionService.getPopularTags(),
  });

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => questionService.getStats(),
  });

  // Create question mutation
  const createQuestionMutation = useMutation({
    mutationFn: questionService.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["popularTags"] });

      setShowQuestionForm(false);
      setNewQuestion({
        title: "",
        content: "",
        subject: "",
        tags: [],
        tagInput: "",
      });

      toast.success("Question posted successfully");
    },
    onError: (error: AxiosError) => {
      toast.error("Failed to post question" + error);
    },
  });

  // Vote on question mutation
  const voteQuestionMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: 1 | -1 }) =>
      questionService.voteQuestion(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Vote recorded");
    },
    onError: () => {
      toast.error("Failed to record vote");
    },
  });

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

  const handleVote = (questionId: string, value: 1 | -1) => {
    voteQuestionMutation.mutate({ id: questionId, value });
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Exam Q&A</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ask questions and get help from the community
          </p>
        </div>
        <Button onClick={() => setShowQuestionForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
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
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Ask a New Question</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQuestionForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Question title"
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Describe your question in detail..."
                rows={4}
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
                <Input
                  placeholder="Add tags (press Enter to add)"
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
                    className="flex items-center gap-1"
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
                >
                  {createQuestionMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Post Question
                </Button>
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
        {questionsLoading && (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
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
            <div className="text-red-500 mb-2">Error loading questions</div>
            <Button
              variant="outline"
              onClick={() =>
                queryClient.refetchQueries({ queryKey: ["questions"] })
              }
            >
              Try Again
            </Button>
          </div>
        )}

        {questionsData?.questions && questionsData.questions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No questions found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "Be the first to ask a question!"}
              </p>
              <Button onClick={() => setShowQuestionForm(true)}>
                Ask a Question
              </Button>
            </CardContent>
          </Card>
        )}

        {questionsData?.questions && questionsData.questions.length > 0 && (
          <>
            <div className="text-sm text-gray-500">
              {questionsData.total} question
              {questionsData.total !== 1 ? "s" : ""} found
            </div>

            {questionsData.questions.map((question: Question) => (
              <Card key={question._id} className="cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Votes */}
                    <div className="flex flex-col items-center w-12">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleVote(question._id, 1)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold text-sm my-1">
                        {question.votes}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleVote(question._id, -1)}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {question.title}
                        </h3>
                        {question.solved && (
                          <Badge variant="secondary">
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
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between text-sm text-gray-500">
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
                          <Badge variant="outline">{question.subject}</Badge>
                          <span>
                            {new Date(question.createdAt).toLocaleDateString()}
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {popularTags?.map((tag: PopularTag) => (
              <Badge
                key={tag.name}
                variant="secondary"
                className="px-3 py-1.5 cursor-pointer"
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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalQuestions || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Answers Posted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAnswers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Solved Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.solvedQuestions || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamQA;
