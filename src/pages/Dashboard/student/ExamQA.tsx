"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Clock,
  Award,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import your TanStack Query hooks
import { useMyProfile } from "@/hooks/useUsers";
import {
  useQuestions,
  usePopularTags,
  useQuestionStats,
  useCreateQuestion,
  useVoteQuestion,
} from "@/hooks/useQuestions";
import {
  useAnswersByQuestion,
  useCreateAnswer,
  useVoteAnswer,
  useAcceptAnswer,
} from "@/hooks/useAnswers";
import type {
  Answer,
  PopularTag,
  Question,
  QuestionStats,
} from "@/types/question";

// Header Component
const Header = ({ onAskQuestion }: { onAskQuestion: () => void }) => {
  const { data: me, isLoading: profileLoading } = useMyProfile();

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "teacher":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "student":
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
  };

  return (
    <header className="py-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
            Exam Q&A Community
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ask questions, share knowledge, and learn together
          </p>
        </div>
        <div className="flex items-center gap-4">
          {profileLoading ? (
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ) : (
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
              <Avatar className="h-10 w-10">
                <AvatarImage src={me?.avatar} alt={me?.name} />
                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                  {me?.name || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {me?.name || "User"}
                  </span>
                  <Badge className={`text-xs ${getRoleBadgeColor(me?.role)}`}>
                    {me?.role || "student"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Award className="h-3 w-3" />
                  <span>{me?.reputation || 0} rep</span>
                </div>
              </div>
            </div>
          )}
          <Button
            onClick={onAskQuestion}
            className="shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </div>
      </div>
    </header>
  );
};

// SearchFilters Component
const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  activeSubject,
  setActiveSubject,
  sortBy,
  setSortBy,
  subjects,
  sortOptions,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeSubject: string;
  setActiveSubject: (subject: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  subjects: string[];
  sortOptions: { value: string; label: string }[];
}) => {
  return (
    <Card className="shadow-sm border-0 bg-white dark:bg-gray-800 overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search questions by title, content, or tags..."
              className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={activeSubject} onValueChange={setActiveSubject}>
            <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
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
            <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
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
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Popular filters:
          </span>
          {["Unanswered", "Solved", "Most Votes", "Recent Activity"].map(
            (filter) => (
              <button
                key={filter}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {filter}
              </button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// QuestionCard Component
const QuestionCard = ({
  question,
  onViewAnswers,
  onVote,
  user,
}: {
  question: Question;
  onViewAnswers: (question: Question) => void;
  onVote: (questionId: string, type: "up" | "down") => void;
  user: { name: string; avatar?: string | null; isTeacher: boolean };
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="shadow-sm border-0 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Vote Column */}
          <div className="flex flex-col items-center w-12 space-y-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVote(question._id, "up");
                  }}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upvote</TooltipContent>
            </Tooltip>
            <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {question.votes}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVote(question._id, "down");
                  }}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Downvote</TooltipContent>
            </Tooltip>
          </div>
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || ""} alt={user.name} />
              <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                {user?.name}
              </AvatarFallback>
            </Avatar>
          </div>
          {/* Content */}
          <div className="flex-1" onClick={() => onViewAnswers(question)}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {question.title}
              </h3>
              {question.solved && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 flex-shrink-0"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                {user.name}
              </span>
              {user.isTeacher && (
                <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs">
                  Teacher
                </Badge>
              )}
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(question.createdAt)}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
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
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 p-0 h-auto"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {question.answersCount} answers
                </Button>
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="h-4 w-4" />
                  {question.views} views
                </span>
              </div>
              <Badge
                variant="outline"
                className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700"
              >
                {question.subject}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// StatsSection Component
const StatsSection = ({ stats }: { stats: QuestionStats | undefined }) => {
  return (
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
            {stats?.data?.totalQuestions || 0}
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
            {stats?.data?.totalAnswers || 0}
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
            {stats?.data?.solvedQuestions || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// PopularTags Component
const PopularTags = ({ tags }: { tags: PopularTag[] | undefined }) => {
  return (
    <Card className="shadow-sm border-0 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
        <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Tag className="h-5 w-5" />
          Popular Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-3">
          {tags?.map((tag: PopularTag) => (
            <Badge
              key={tag._id}
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
  );
};

// QuestionForm Component
const QuestionForm = ({
  onClose,
  subjects,
}: {
  onClose: () => void;
  subjects: string[];
}) => {
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    subject: "",
    tags: [] as string[],
    tagInput: "",
  });
  const createQuestionMutation = useCreateQuestion();

  const handleCreateQuestion = () => {
    if (!newQuestion.title || !newQuestion.content || !newQuestion.subject) {
      toast.error("Please fill in all required fields");
      return;
    }

    createQuestionMutation.mutate(
      {
        title: newQuestion.title,
        content: newQuestion.content,
        subject: newQuestion.subject,
        tags: newQuestion.tags,
      },
      {
        onSuccess: () => {
          onClose();
          setNewQuestion({
            title: "",
            content: "",
            subject: "",
            tags: [],
            tagInput: "",
          });
          toast.success("Question posted successfully");
        },
        onError: (error) => {
          toast.error("Failed to post question");
          console.error("Error posting question:", error);
        },
      }
    );
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
    <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ask a New Question
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Question Title *
            </label>
            <Input
              id="title"
              placeholder="Be specific and imagine you're asking a question to another person"
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              value={newQuestion.title}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, title: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Detailed Question *
            </label>
            <Textarea
              id="content"
              placeholder="Include all the information someone would need to answer your question"
              rows={4}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              value={newQuestion.content}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, content: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Subject *
              </label>
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
            </div>
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tags
              </label>
              <Input
                id="tags"
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Added Tags
            </label>
            <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
              {newQuestion.tags.length === 0 ? (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No tags added yet
                </span>
              ) : (
                newQuestion.tags.map((tag) => (
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
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateQuestion}
              disabled={createQuestionMutation.isPending}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              {createQuestionMutation.isPending
                ? "Posting..."
                : "Post Question"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// AnswerDialog Component
const AnswerDialog = ({
  open,
  onOpenChange,
  question,
  questionAuthor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  questionAuthor: { name: string; avatar?: string | null; isTeacher: boolean };
}) => {
  const [newAnswer, setNewAnswer] = useState("");
  const {
    data: answersData,
    isLoading: answersLoading,
    refetch: refetchAnswers,
  } = useAnswersByQuestion(question?._id || "", {
    page: 1,
    limit: 10,
  });

  // Updated to handle the new response structure
  const answers = answersData?.data?.answers || [];
  const pagination = answersData?.data?.pagination;
  const total = pagination?.total || 0;

  const createAnswerMutation = useCreateAnswer();
  const voteAnswerMutation = useVoteAnswer();
  const acceptAnswerMutation = useAcceptAnswer();

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) {
      toast.error("Please enter your answer");
      return;
    }
    if (!question) {
      toast.error("No question selected");
      return;
    }

    createAnswerMutation.mutate(
      {
        questionId: question._id,
        content: newAnswer,
      },
      {
        onSuccess: () => {
          setNewAnswer("");
          refetchAnswers();
          toast.success("Answer posted successfully");
        },
        onError: (error) => {
          toast.error("Failed to post answer");
          console.error("Error posting answer:", error);
        },
      }
    );
  };

  const handleVoteAnswer = (answerId: string, type: "up" | "down") => {
    voteAnswerMutation.mutate(
      { id: answerId, type },
      {
        onSuccess: () => {
          refetchAnswers();
        },
        onError: (error) => {
          toast.error("Failed to vote on answer");
          console.error("Error voting on answer:", error);
        },
      }
    );
  };

  const handleAcceptAnswer = (answerId: string) => {
    acceptAnswerMutation.mutate(answerId, {
      onSuccess: () => {
        refetchAnswers();
        toast.success("Answer accepted as correct");
      },
      onError: (error) => {
        toast.error("Failed to accept answer");
        console.error("Error accepting answer:", error);
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white dark:bg-gray-800 border-0 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
            {question?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Question Details */}
          <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={questionAuthor.avatar || ""}
                      alt={questionAuthor.name}
                    />
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                      {questionAuthor.name || "A"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {questionAuthor.name || "Anonymous"}
                    </span>
                    {questionAuthor.isTeacher && (
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs">
                        Teacher
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                    >
                      {question?.subject}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {question?.content}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {question?.createdAt && formatDate(question.createdAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Answers Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Answers ({total})
              </h3>
            </div>
            {answersLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <Card
                    key={i}
                    className="shadow-sm border-0 bg-white dark:bg-gray-800"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center w-12">
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : answers.length > 0 ? (
              <div className="space-y-4">
                {answers.map((answer: Answer) => (
                  <Card
                    key={answer._id}
                    className={`shadow-sm border-0 bg-white dark:bg-gray-800 ${
                      answer.isAccepted
                        ? "ring-2 ring-green-500 dark:ring-green-400"
                        : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={answer.user.avatar || ""}
                              alt={answer.user.name}
                            />
                            <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                              {answer.user.name}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {answer.user.name}
                              </span>
                              {answer.user.isTeacher && (
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                >
                                  Teacher
                                </Badge>
                              )}
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Award className="h-3 w-3" />
                                <span>{answer.user.reputation} rep</span>
                              </div>
                            </div>
                            {answer.isAccepted && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accepted Answer
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {answer.content}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                      onClick={() =>
                                        handleVoteAnswer(answer._id, "up")
                                      }
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Upvote</TooltipContent>
                                </Tooltip>
                                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                  {answer.votes}
                                </span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                      onClick={() =>
                                        handleVoteAnswer(answer._id, "down")
                                      }
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Downvote</TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {answer.createdAt &&
                                  formatDate(answer.createdAt)}
                              </div>
                            </div>
                            {!answer.isAccepted &&
                              question &&
                              !question.solved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAcceptAnswer(answer._id)}
                                  className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-900/20"
                                >
                                  Accept Answer
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8 shadow-sm border-0 bg-white dark:bg-gray-800">
                <CardContent>
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No answers yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Be the first to answer this question!
                  </p>
                </CardContent>
              </Card>
            )}
            {/* Add Answer Form */}
            <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
                  Your Answer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write your answer here..."
                    rows={4}
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={
                        createAnswerMutation.isPending || !newAnswer.trim()
                      }
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                      {createAnswerMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Post Answer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
const ExamQA: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [showAnswersDialog, setShowAnswersDialog] = useState(false);

  // Fetch questions with filtering using TanStack Query
  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuestions({
    subject: activeSubject !== "all" ? activeSubject : undefined,
    search: searchQuery || undefined,
    sort: sortBy as "newest" | "most-voted" | "most-viewed",
    page: 1,
    limit: 10,
  });

  // Access questions like this:
  const questions = questionsData?.data?.questions || [];
  const pagination = questionsData?.data;
  const total = pagination?.total || 0;

  // Fetch popular tags using TanStack Query
  const { data: popularTagsData } = usePopularTags();
  const popularTags = popularTagsData?.data || [];

  // Fetch statistics using TanStack Query
  const { data: statsData } = useQuestionStats();
  const stats = statsData;

  // Vote question mutation using TanStack Query
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

  const handleRefresh = () => {
    refetchQuestions();
  };

  const handleViewAnswers = (question: Question) => {
    setSelectedQuestion(question);
    setShowAnswersDialog(true);
  };

  const handleVote = (questionId: string, type: "up" | "down") => {
    voteQuestionMutation.mutate(
      { id: questionId, type },
      {
        onSuccess: () => {
          toast.success(`Vote ${type}cast!`);
        },
        onError: (error) => {
          toast.error("Failed to vote");
          console.error("Error voting:", error);
        },
      }
    );
  };

  // Get user info for a question
  const getUserInfo = (user: {
    name: string;
    avatar?: string | null;
    isTeacher: boolean;
  }) => {
    return user;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Header onAskQuestion={() => setShowQuestionForm(true)} />
          <div className="mt-8 space-y-6">
            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeSubject={activeSubject}
              setActiveSubject={setActiveSubject}
              sortBy={sortBy}
              setSortBy={setSortBy}
              subjects={subjects}
              sortOptions={sortOptions}
            />
            {/* Stats Section */}
            <StatsSection stats={stats} />
            {/* Ask Question Form */}
            {showQuestionForm && (
              <QuestionForm
                onClose={() => setShowQuestionForm(false)}
                subjects={subjects}
              />
            )}
            {/* Questions List */}
            <div className="space-y-4">
              {questionsLoading && (
                <div className="space-y-4">
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
                </div>
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
                      <button
                        onClick={handleRefresh}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </button>
                    </CardContent>
                  </Card>
                </div>
              )}
              {questions.length === 0 && !questionsLoading && (
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
                    <button
                      onClick={() => setShowQuestionForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ask a Question
                    </button>
                  </CardContent>
                </Card>
              )}
              {questions.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {total} question{total !== 1 ? "s" : ""} found
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Sort by:
                      </span>
                      <div className="flex rounded-md shadow-sm">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={`px-3 py-1 text-sm font-medium border ${
                              sortBy === option.value
                                ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 z-10"
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            } ${
                              option === sortOptions[0] ? "rounded-l-md" : ""
                            } ${
                              option === sortOptions[sortOptions.length - 1]
                                ? "rounded-r-md -ml-px"
                                : "-ml-px"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {questions.map((question: Question) => (
                      <QuestionCard
                        key={question._id}
                        question={question}
                        onViewAnswers={handleViewAnswers}
                        onVote={handleVote}
                        user={getUserInfo(question.user)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Popular Tags */}
            <PopularTags tags={popularTags} />
          </div>
        </div>
      </div>
      {/* Answers Dialog */}
      <AnswerDialog
        open={showAnswersDialog}
        onOpenChange={setShowAnswersDialog}
        question={selectedQuestion}
        questionAuthor={
          selectedQuestion
            ? getUserInfo(selectedQuestion.user)
            : { name: "", isTeacher: false }
        }
      />
    </TooltipProvider>
  );
};

export default ExamQA;
