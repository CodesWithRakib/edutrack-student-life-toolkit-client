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

  // Get type color
  const getTypeColor = (type: string) => {
    const colors = {
      lecture: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      lab: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      tutorial:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      discussion:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Error loading schedule data
          </h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Class Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your classes and track your weekly schedule
          </p>
        </div>
        <Button
          onClick={() => setShowAddClass(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar & Filters */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger>
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day View</SelectItem>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium">Class Types</p>
                {["lecture", "lab", "tutorial", "discussion"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={type}
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleTypeFilter(type)}
                    />
                    <label htmlFor={type} className="text-sm capitalize">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {classesLoading || weeklyLoading ? (
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-h-[200px] border rounded-lg p-2 animate-pulse"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Week View */}
                  {selectedView === "week" && (
                    <div className="grid grid-cols-6 gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                          key={day}
                          className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2"
                        >
                          {day}
                        </div>
                      ))}

                      {days.map((day) => (
                        <div
                          key={day}
                          className="min-h-[200px] border rounded-lg p-2"
                        >
                          {filteredWeeklySchedule[day]?.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                              No classes
                            </p>
                          ) : (
                            filteredWeeklySchedule[day]?.map((cls) => (
                              <div
                                key={cls._id}
                                className="p-3 mb-2 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors group"
                              >
                                <div className="flex items-start justify-between">
                                  <Badge className={getTypeColor(cls.type)}>
                                    {cls.type}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {formatTime(cls.startTime)} -{" "}
                                    {formatTime(cls.endTime)}
                                  </span>
                                </div>
                                <h4 className="font-semibold mt-2 text-sm">
                                  {cls.title}
                                </h4>
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {cls.location}
                                </div>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {cls.instructor}
                                </div>
                                <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
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
                                    className="h-6 w-6 text-destructive"
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
                          <div key={hour} className="flex border-b pb-4">
                            <div className="w-16 text-sm text-gray-500">
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
                                    className="p-3 rounded-lg border bg-card mb-2 group"
                                  >
                                    <div className="flex items-center justify-between">
                                      <Badge className={getTypeColor(cls.type)}>
                                        {cls.type}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        {formatTime(cls.startTime)} -{" "}
                                        {formatTime(cls.endTime)}
                                      </span>
                                    </div>
                                    <h4 className="font-semibold mt-2">
                                      {cls.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {cls.location} • {cls.instructor}
                                    </p>
                                    <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => setEditingClass(cls)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive"
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

          {/* Upcoming Classes */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center p-3 rounded-lg border animate-pulse"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="ml-4 flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : upcomingClasses.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming classes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingClasses.slice(0, 3).map((cls) => (
                    <div
                      key={cls._id}
                      className="flex items-center p-3 rounded-lg border group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold">{cls.title}</h4>
                        <p className="text-sm text-gray-500">
                          {formatTime(cls.startTime)} -{" "}
                          {formatTime(cls.endTime)} • {cls.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setEditingClass(cls)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => handleDeleteClass(cls._id)}
                          disabled={deleteClassMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
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
