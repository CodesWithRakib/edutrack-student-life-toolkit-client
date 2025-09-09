"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ClassCard from "./ClassCard";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Class } from "@/types/class";

interface Props {
  classes: Class[];
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeeklyScheduleGrid({ classes }: Props) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (cls: Class) => {
      await fetch(`/api/classes/${cls._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cls),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const movedClass = classes.find((c) => c._id === draggableId);
    if (movedClass) {
      const updated = {
        ...movedClass,
        day: destination.droppableId.toLowerCase(),
      };
      updateMutation.mutate(updated);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule (Drag & Drop)</CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {days.map((day) => {
              const dayClasses = classes.filter(
                (cls) => cls.day.toLowerCase() === day.toLowerCase()
              );
              return (
                <Droppable key={day} droppableId={day}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="p-2 border rounded-md min-h-[150px] bg-muted/20"
                    >
                      <h3 className="font-semibold mb-2">{day}</h3>
                      {dayClasses.map((cls, index) => (
                        <Draggable
                          key={cls._id}
                          draggableId={cls._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <ClassCard cls={cls} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
}
