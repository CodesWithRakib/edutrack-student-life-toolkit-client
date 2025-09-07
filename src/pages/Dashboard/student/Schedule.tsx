import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { classService } from "@/services/classService";
import { toast } from "sonner";
import type { Class } from "@/types/class";
import AddClassDialog from "@/components/dashboard/student/AddClassDialog";
import EditClassDialog from "@/components/dashboard/student/EditClassDialog";

const Schedule: React.FC = () => {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "lecture",
    "lab",
    "tutorial",
    "discussion",
  ]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  // Fetch classes
  const {
    data: classes = [],
    isLoading: classesLoading,
    error: classesError,
  } = useQuery<Class[]>({
    queryKey: ["classes"],
    queryFn: classService.getClasses,
  });

  // Fetch weekly schedule
  const {
    data: weeklySchedule = {},
    isLoading: weeklyLoading,
    error: weeklyError,
  } = useQuery<Record<string, Class[]>>({
    queryKey: ["weekly-schedule"],
    queryFn: classService.getWeeklySchedule,
  });

  // Fetch upcoming classes
  const {
    data: upcomingClasses = [],
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useQuery<Class[]>({
    queryKey: ["upcoming-classes"],
    queryFn: classService.getUpcomingClasses,
  });

  // Delete class mutation
  const deleteClassMutation = useMutation({
    mutationFn: classService.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-classes"] });
      toast.success("Class deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete class");
    },
  });

  // Handle class deletion
  const handleDeleteClass = (id: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      deleteClassMutation.mutate(id);
    }
  };

  // Toggle class type filter
  const toggleTypeFilter = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Filter classes based on search term and selected types
  const filteredClasses = classes.filter(
    (cls) =>
      cls.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      selectedTypes.includes(cls.type)
  );

  // Filter weekly schedule
  const filteredWeeklySchedule = Object.fromEntries(
    Object.entries(weeklySchedule).map(([day, dayClasses]) => [
      day,
      dayClasses.filter(
        (cls) =>
          cls.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          selectedTypes.includes(cls.type)
      ),
    ])
  );

  // Get type color with enhanced palette for both light and dark modes
  const getTypeColor = (type: string) => {
    const colors = {
      lecture:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30",
      lab: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30",
      tutorial:
        "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300 border border-violet-200 dark:border-violet-800/30",
      discussion:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border border-gray-200 dark:border-gray-700"
    );
  };

  // Format time for display
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Days of the week
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  if (classesError || weeklyError || upcomingError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm max-w-md">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error loading schedule data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

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
              <Select value={selectedView} onValueChange={setSelectedView}>
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
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Class Types
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["lecture", "lab", "tutorial", "discussion"].map((type) => (
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
            </CardContent>
          </Card>
        </div>

        {/* Schedule Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Schedule Card */}
          <Card className="shadow-md border-0 bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 pb-4">
              <CardTitle className="text-blue-700 dark:text-blue-400">
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {classesLoading || weeklyLoading ? (
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-h-[200px] bg-gray-100 dark:bg-gray-700/30 rounded-lg p-2 animate-pulse"
                    >
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Week View */}
                  {selectedView === "week" && (
                    <div className="grid grid-cols-6 gap-3">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                          key={day}
                          className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                        >
                          {day}
                        </div>
                      ))}
                      {days.map((day) => (
                        <div
                          key={day}
                          className="min-h-[200px] bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-100 dark:border-gray-700/30 shadow-sm"
                        >
                          {filteredWeeklySchedule[day]?.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-500 text-center py-8">
                              No classes
                            </p>
                          ) : (
                            filteredWeeklySchedule[day]?.map((cls) => (
                              <div
                                key={cls._id}
                                className="p-3 mb-2 rounded-lg bg-white dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
                              >
                                <div className="flex items-start justify-between">
                                  <Badge className={getTypeColor(cls.type)}>
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
                                <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingClass(cls);
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClass(cls._id);
                                    }}
                                    disabled={deleteClassMutation.isPending}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ))}
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
                                  >
                                    <div className="flex items-center justify-between">
                                      <Badge className={getTypeColor(cls.type)}>
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
                                        <Trash2 className="h-3 w-3" />
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
                  {upcomingClasses.slice(0, 3).map((cls) => (
                    <div
                      key={cls._id}
                      className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/30 hover:shadow-md transition-all duration-200 group"
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
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className={getTypeColor(cls.type)}>
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
      <AddClassDialog open={showAddClass} onOpenChange={setShowAddClass} />
      {editingClass && (
        <EditClassDialog
          open={!!editingClass}
          onOpenChange={(open) => !open && setEditingClass(null)}
          classData={editingClass}
        />
      )}
    </div>
  );
};

export default Schedule;
