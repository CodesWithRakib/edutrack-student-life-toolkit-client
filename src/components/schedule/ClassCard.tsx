"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import EditClassDialog from "./EditClassDialog";
import { Class } from "@/types/schedule";

interface Props {
  cls: Class;
}

export default function ClassCard({ cls }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/classes/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class deleted");
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this class?")) {
      deleteMutation.mutate(cls._id);
    }
  };

  return (
    <Card className="p-3 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{cls.subject}</h4>
          <p className="text-sm text-muted-foreground">
            {cls.startTime} - {cls.endTime}
          </p>
          <p className="text-sm">{cls.instructor}</p>
        </div>
        <Badge>{cls.type}</Badge>
      </div>

      {cls.location && (
        <p className="text-xs text-muted-foreground">📍 {cls.location}</p>
      )}

      <div className="flex gap-2 justify-end">
        <EditClassDialog classData={cls}>
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </EditClassDialog>
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}
