import React, { useState, useMemo, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  BookOpen,
  Filter,
  Edit,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type {
  Class,
  ClassType,
  DayOfWeek,
  ClassStats,
  WeeklySchedule,
  WeeklyScheduleResponse,
} from "@/types/class";
import AddClassDialog from "@/components/dashboard/student/AddClassDialog";
import EditClassDialog from "@/components/dashboard/student/EditClassDialog";
import {
  useClasses,
  useWeeklySchedule,
  useUpcomingClasses,
  useDeleteClass,
  useClassStats,
} from "@/hooks/useClasses";

// Initialize SweetAlert2 with React content
const MySwal = withReactContent(Swal);

// Define view types
type ScheduleView = "day" | "week" | "month";

// Define mock data for development or when API is unavailable
const mockClasses: Class[] = [
  {
    _id: "1",
    user: "user1",
    title: "Introduction to React",
    startTime: "09:00",
    endTime: "10:30",
    location: "Room 101",
    instructor: "Dr. Smith",
    type: "lecture",
    day: "monday",
    color: "#3b82f6",
    description: "Basic concepts of React",
    recurring: "weekly",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    _id: "2",
    user: "user1",
    title: "React Lab",
    startTime: "14:00",
    endTime: "16:00",
    location: "Computer Lab",
    instructor: "Prof. Johnson",
    type: "lab",
    day: "tuesday",
    color: "#10b981",
    description: "Hands-on React exercises",
    recurring: "weekly",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    _id: "3",
    user: "user1",
    title: "Advanced React Patterns",
    startTime: "11:00",
    endTime: "12:30",
    location: "Room 205",
    instructor: "Dr. Williams",
    type: "tutorial",
    day: "wednesday",
    color: "#8b5cf6",
    description: "Advanced React design patterns",
    recurring: "weekly",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    _id: "4",
    user: "user1",
    title: "React Discussion",
    startTime: "15:00",
    endTime: "16:30",
    location: "Seminar Room",
    instructor: "Dr. Brown",
    type: "discussion",
    day: "friday",
    color: "#f59e0b",
    description: "Open discussion on React topics",
    recurring: "weekly",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

const mockWeeklySchedule: WeeklySchedule = {
  monday: [mockClasses[0]],
  tuesday: [mockClasses[1]],
  wednesday: [mockClasses[2]],
  thursday: [],
  friday: [mockClasses[3]],
  saturday: [],
  sunday: [],
};

const mockWeeklyScheduleResponse: WeeklyScheduleResponse = {
  weeklySchedule: mockWeeklySchedule,
  weekDates: {
    start: new Date().toISOString(), // <-- convert to string
    end: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
  },
};

const mockClassStats: ClassStats = {
  classCount: 4,
  busiestDay: "monday",
  totalHours: "10",
  classesByType: {
    lecture: 1,
    lab: 1,
    tutorial: 1,
    discussion: 1,
  },
  classesByDay: {
    monday: 1,
    tuesday: 1,
    wednesday: 1,
    thursday: 0,
    friday: 1,
    saturday: 0,
    sunday: 0,
  },
};

const Schedule: React.FC = () => {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState<ScheduleView>("week");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<ClassType[]>([
    "lecture",
    "lab",
    "tutorial",
    "discussion",
  ]);
  const [showAddClass, setShowAddClass] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  // Use custom hooks
  const {
    data: classes = mockClasses,
    isLoading: classesLoading,
    error: classesError,
  } = useClasses();

  // Fixed: Properly extract weeklySchedule from the response
  const {
    data: weeklyScheduleResponse = mockWeeklyScheduleResponse,
    isLoading: weeklyLoading,
    error: weeklyError,
  } = useWeeklySchedule();

  // Extract the actual schedule data from the response
  const weeklySchedule = weeklyScheduleResponse.weeklySchedule;

  const {
    data: upcomingClasses = mockClasses.slice(0, 3),
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useUpcomingClasses(5);

  const {
    data: classStats = mockClassStats,
    isLoading: statsLoading,
    error: statsError,
  } = useClassStats();

  const deleteClassMutation = useDeleteClass();

  // Handle class deletion with SweetAlert2
  const handleDeleteClass = async (id: string): Promise<void> => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        container: "z-[9999]",
      },
    });

    if (result.isConfirmed) {
      deleteClassMutation.mutate(id, {
        onSuccess: () => {
          MySwal.fire("Deleted!", "Your class has been deleted.", "success");
        },
        onError: () => {
          MySwal.fire("Error!", "Failed to delete class.", "error");
        },
      });
    }
  };

  // Handle successful class addition
  const handleAddClassSuccess = () => {
    setShowAddClass(false);
    toast.success("Class added successfully");
    // Invalidate queries to refresh the data
    queryClient.invalidateQueries({ queryKey: ["classes"] });
    queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
    queryClient.invalidateQueries({ queryKey: ["upcoming-classes"] });
    queryClient.invalidateQueries({ queryKey: ["classes-Stats"] });
  };

  // Handle successful class edit
  const handleEditClassSuccess = () => {
    setEditingClass(null);
    toast.success("Class updated successfully");
    // Invalidate queries to refresh the data
    queryClient.invalidateQueries({ queryKey: ["classes"] });
    queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
    queryClient.invalidateQueries({ queryKey: ["upcoming-classes"] });
    queryClient.invalidateQueries({ queryKey: ["classes-stats"] });
  };

  // Toggle class type filter
  const toggleTypeFilter = (type: ClassType): void => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Filter classes based on search term and selected types
  const filteredClasses = useMemo<Class[]>(
    () =>
      classes.filter(
        (cls) =>
          cls.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          selectedTypes.includes(cls.type)
      ),
    [classes, searchTerm, selectedTypes]
  );

  // Fixed: Properly filter the weekly schedule data
  const filteredWeeklySchedule = useMemo<WeeklySchedule>(() => {
    const result: WeeklySchedule = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    (Object.entries(weeklySchedule) as [DayOfWeek, Class[]][]).forEach(
      ([day, dayClasses]) => {
        result[day] = dayClasses.filter(
          (cls) =>
            cls.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            selectedTypes.includes(cls.type)
        );
      }
    );

    return result;
  }, [weeklySchedule, searchTerm, selectedTypes]);

  // Get current week dates
  const getCurrentWeekDates = (): Date[] => {
    const now = new Date();
    now.setDate(now.getDate() + currentWeekOffset * 7);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Start from Monday
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const currentWeekDates = getCurrentWeekDates();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
  const fullDayNames = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const satisfies readonly DayOfWeek[];

  // Get type color with enhanced palette
  const getTypeColor = (type: ClassType): string => {
    const colors: Record<ClassType, string> = {
      lecture:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30",
      lab: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30",
      tutorial:
        "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300 border border-violet-200 dark:border-violet-800/30",
      discussion:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30",
    };
    return colors[type];
  };

  // Get type icon
  const getTypeIcon = (type: ClassType): ReactNode => {
    const icons: Record<ClassType, ReactNode> = {
      lecture: <BookOpen className="h-3 w-3" />,
      lab: <BookOpen className="h-3 w-3" />,
      tutorial: <BookOpen className="h-3 w-3" />,
      discussion: <BookOpen className="h-3 w-3" />,
    };
    return icons[type];
  };

  // Format time for display
  const formatTime = (time: string): string => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Navigation functions
  const navigateToCurrentWeek = (): void => setCurrentWeekOffset(0);
  const navigateToPreviousWeek = (): void =>
    setCurrentWeekOffset((prev) => prev - 1);
  const navigateToNextWeek = (): void =>
    setCurrentWeekOffset((prev) => prev + 1);

  // Toggle class expansion
  const toggleExpandClass = (id: string): void => {
    setExpandedClass(expandedClass === id ? null : id);
  };

  if (classesError || weeklyError || upcomingError || statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error loading schedule data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please try again later
          </p>
          <Button
            onClick={() => queryClient.refetchQueries()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const isLoading =
    classesLoading || weeklyLoading || upcomingLoading || statsLoading;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Class Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your classes and track your weekly schedule
            {classStats && (
              <span className="ml-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                {classStats.classCount} classes • {classStats.totalHours} hr
                this week
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={() => setShowAddClass(true)}
          className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar & Filters */}
        <div className="lg:col-span-1 space-y-4">
          {/* Calendar Card */}
          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-0 shadow-sm"
              />
              {classStats && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Quick Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-white dark:bg-gray-600/30 rounded">
                      <div className="font-bold text-blue-600 dark:text-blue-400">
                        {classStats.classCount}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Total
                      </div>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-600/30 rounded">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {classStats.totalHours} hr
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        This Week
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filters Card */}
          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Select
                value={selectedView}
                onValueChange={(value: ScheduleView) => setSelectedView(value)}
              >
                <SelectTrigger className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day View</SelectItem>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="shadow-sm border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 pl-10"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Class Types
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    ["lecture", "lab", "tutorial", "discussion"] as ClassType[]
                  ).map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={type}
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleTypeFilter(type)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:focus:ring-blue-700/30"
                      />
                      <label
                        htmlFor={type}
                        className="text-sm capitalize text-gray-700 dark:text-gray-300"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTypes([
                    "lecture",
                    "lab",
                    "tutorial",
                    "discussion",
                  ]);
                  setSearchTerm("");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Schedule Card */}
          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-700 dark:text-blue-400">
                  Weekly Schedule
                </CardTitle>
                {selectedView === "week" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={navigateToPreviousWeek}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={navigateToCurrentWeek}
                      className="text-xs"
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={navigateToNextWeek}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <>
                  {/* Week View */}
                  {selectedView === "week" && (
                    <div className="space-y-4">
                      {/* Week Navigation Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                          Week of {formatDate(currentWeekDates[0])} -{" "}
                          {formatDate(currentWeekDates[6])}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {classStats?.totalHours} total hours
                          </span>
                        </div>
                      </div>

                      {/* Horizontal Scroll Container */}
                      <div className="overflow-x-auto pb-2">
                        <div className="min-w-[800px]">
                          {/* Day Headers */}
                          <div className="grid grid-cols-7 gap-2 mb-2">
                            {weekDays.map((day, index) => {
                              const isToday =
                                currentWeekDates[index].toDateString() ===
                                new Date().toDateString();
                              return (
                                <div
                                  key={day}
                                  className={`text-center font-semibold text-sm py-2 rounded-lg ${
                                    isToday
                                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                      : "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400"
                                  }`}
                                >
                                  {day}
                                  <div
                                    className={`text-xs font-normal ${
                                      isToday
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-500"
                                    }`}
                                  >
                                    {formatDate(currentWeekDates[index])}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Schedule Grid */}
                          <div className="grid grid-cols-7 gap-2">
                            {fullDayNames.map((day) => (
                              <div
                                key={day}
                                className="min-h-[400px] bg-gray-50 dark:bg-gray-800/30 rounded-lg p-2 border border-gray-100 dark:border-gray-700/30 shadow-sm"
                              >
                                {filteredWeeklySchedule[day]?.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500 dark:text-gray-500">
                                    <CalendarIcon className="h-8 w-8 mb-2 opacity-30" />
                                    <p className="text-sm">No classes</p>
                                  </div>
                                ) : (
                                  filteredWeeklySchedule[day]?.map((cls) => (
                                    <div
                                      key={cls._id}
                                      className={`p-3 mb-2 rounded-lg bg-white dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/30 hover:shadow-md transition-all duration-200 cursor-pointer ${
                                        expandedClass === cls._id
                                          ? "ring-2 ring-blue-500 dark:ring-blue-400"
                                          : ""
                                      }`}
                                      onClick={() => toggleExpandClass(cls._id)}
                                      style={{
                                        borderLeft: `4px solid ${cls.color}`,
                                      }}
                                    >
                                      <div className="flex items-start justify-between">
                                        <Badge
                                          className={`${getTypeColor(
                                            cls.type
                                          )} flex items-center gap-1`}
                                        >
                                          {getTypeIcon(cls.type)}
                                          {cls.type}
                                        </Badge>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                          {formatTime(cls.startTime)} -{" "}
                                          {formatTime(cls.endTime)}
                                        </span>
                                      </div>
                                      <h4 className="font-semibold mt-2 text-sm text-gray-800 dark:text-gray-200">
                                        {cls.title}
                                      </h4>
                                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {cls.location}
                                      </div>
                                      <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <BookOpen className="h-3 w-3 mr-1" />
                                        {cls.instructor}
                                      </div>

                                      {/* Expanded Details */}
                                      {expandedClass === cls._id && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/30 animate-fadeIn">
                                          {cls.description && (
                                            <div className="flex items-start mb-2">
                                              <Info className="h-3 w-3 mr-1 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {cls.description}
                                              </p>
                                            </div>
                                          )}
                                          <div className="flex justify-end gap-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingClass(cls);
                                              }}
                                            >
                                              <Edit className="h-3 w-3 mr-1" />
                                              Edit
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClass(cls._id);
                                              }}
                                              disabled={
                                                deleteClassMutation.isPending
                                              }
                                            >
                                              {deleteClassMutation.isPending ? (
                                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                              ) : (
                                                <Trash2 className="h-3 w-3 mr-1" />
                                              )}
                                              Delete
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Day View */}
                  {selectedView === "day" && (
                    <div className="space-y-4">
                      {Array.from({ length: 12 }, (_, i) => i + 8).map(
                        (hour) => (
                          <div
                            key={hour}
                            className="flex border-b border-gray-100 dark:border-gray-700/30 pb-4"
                          >
                            <div className="w-16 text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {hour}:00
                            </div>
                            <div className="flex-1">
                              {filteredClasses
                                .filter((cls) => {
                                  const startHour = parseInt(
                                    cls.startTime.split(":")[0]
                                  );
                                  return startHour === hour;
                                })
                                .map((cls) => (
                                  <div
                                    key={cls._id}
                                    className="p-3 rounded-lg bg-white dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/30 mb-2 shadow-sm hover:shadow-md transition-all duration-200 group"
                                    style={{
                                      borderLeft: `4px solid ${cls.color}`,
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <Badge
                                        className={`${getTypeColor(
                                          cls.type
                                        )} flex items-center gap-1`}
                                      >
                                        {getTypeIcon(cls.type)}
                                        {cls.type}
                                      </Badge>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                        {formatTime(cls.startTime)} -{" "}
                                        {formatTime(cls.endTime)}
                                      </span>
                                    </div>
                                    <h4 className="font-semibold mt-2 text-gray-800 dark:text-gray-200">
                                      {cls.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {cls.location} • {cls.instructor}
                                    </p>
                                    <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        onClick={() => setEditingClass(cls)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() =>
                                          handleDeleteClass(cls._id)
                                        }
                                        disabled={deleteClassMutation.isPending}
                                      >
                                        {deleteClassMutation.isPending ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Classes Card */}
          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <CardTitle className="text-blue-700 dark:text-blue-400">
                Upcoming Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {upcomingLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 animate-pulse"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                      <div className="ml-4 flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : upcomingClasses.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-500">
                  <CalendarIcon className="h-16 w-16 mx-auto mb-3 opacity-30" />
                  <p className="text-lg">No upcoming classes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingClasses.map((cls) => (
                    <div
                      key={cls._id}
                      className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/30 hover:shadow-md transition-all duration-200 group"
                      style={{
                        borderLeft: `4px solid ${cls.color}`,
                      }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg flex items-center justify-center shadow-sm">
                        <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                          {cls.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatTime(cls.startTime)} -{" "}
                          {formatTime(cls.endTime)} • {cls.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => setEditingClass(cls)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => handleDeleteClass(cls._id)}
                          disabled={deleteClassMutation.isPending}
                        >
                          {deleteClassMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Badge
                        className={`${getTypeColor(
                          cls.type
                        )} flex items-center gap-1`}
                      >
                        {getTypeIcon(cls.type)}
                        {cls.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AddClassDialog
        open={showAddClass}
        onOpenChange={setShowAddClass}
        onSuccess={handleAddClassSuccess}
      />
      {editingClass && (
        <EditClassDialog
          open={!!editingClass}
          onOpenChange={(open) => !open && setEditingClass(null)}
          classData={editingClass}
          onSuccess={handleEditClassSuccess}
        />
      )}
    </div>
  );
};

export default Schedule;
