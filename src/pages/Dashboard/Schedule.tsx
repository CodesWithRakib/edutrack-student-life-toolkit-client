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
import { Label } from "@/components/ui/label";

const Schedule = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      subject: "Mathematics",
      time: "09:00 - 10:30",
      day: "Monday",
      instructor: "Dr. Smith",
      color: "bg-blue-100",
    },
    {
      id: 2,
      subject: "Physics",
      time: "11:00 - 12:30",
      day: "Monday",
      instructor: "Prof. Johnson",
      color: "bg-green-100",
    },
    {
      id: 3,
      subject: "Literature",
      time: "14:00 - 15:30",
      day: "Tuesday",
      instructor: "Dr. Williams",
      color: "bg-purple-100",
    },
  ]);

  const [newClass, setNewClass] = useState({
    subject: "",
    time: "",
    day: "",
    instructor: "",
    color: "bg-blue-100",
  });

  const handleAddClass = () => {
    if (newClass.subject && newClass.time && newClass.day) {
      setClasses([...classes, { ...newClass, id: classes.length + 1 }]);
      setNewClass({
        subject: "",
        time: "",
        day: "",
        instructor: "",
        color: "bg-blue-100",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Schedule</h1>
        <Button>Add New Class</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Weekly Schedule</CardTitle>
              <CardDescription>Manage your class schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.map((classItem) => (
                  <div
                    key={classItem.id}
                    className={`p-4 rounded-lg ${classItem.color}`}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-bold">{classItem.subject}</h3>
                      <span>{classItem.time}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span>{classItem.day}</span>
                      <span>{classItem.instructor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Class</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newClass.subject}
                  onChange={(e) =>
                    setNewClass({ ...newClass, subject: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={newClass.time}
                  onChange={(e) =>
                    setNewClass({ ...newClass, time: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="day">Day</Label>
                <Input
                  id="day"
                  value={newClass.day}
                  onChange={(e) =>
                    setNewClass({ ...newClass, day: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={newClass.instructor}
                  onChange={(e) =>
                    setNewClass({ ...newClass, instructor: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddClass} className="w-full">
                Add Class
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
