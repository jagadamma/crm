import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/store/taskStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Edit,
  MoreVertical,
  Trash,
  Calendar,
  Tag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskForm from "./TaskForm";

interface SortableTaskProps {
  task: Task;
  getSubtasks: (taskId: string) => Task[];
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setIsDialogOpen: (open: boolean) => void;
}

export const SortableTask: React.FC<SortableTaskProps> = ({
  task,
  getSubtasks,
  updateTask,
  deleteTask,
  setIsDialogOpen,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  const subtasks = getSubtasks(task.id);

  // Calculate task priority color
  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-task p-4 rounded-md border bg-white shadow-sm ${isDragging ? "opacity-50" : ""
        } hover:shadow-md transition-shadow cursor-move`}
    >
      <div className="flex items-start">
        <div className="flex-1 flex flex-col gap-3 text-left">
          {/* Task Title and Menu */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base text-left">{task.title}</h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onClick={() => {
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    <TaskForm
                      onSubmit={(data) => {
                        updateTask(task.id, data);
                        setIsDialogOpen(false);
                      }}
                      initialValues={task}
                      parentId={task.parentId}
                    />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this task?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteTask(task.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Task Description */}
          {task.description && (
            <p className="text-sm text-muted-foreground text-left">
              {task.description}
            </p>
          )}

          {/* Task Details */}
          <div className="flex flex-col gap-2 text-left">
            {/* Priority Badge */}
            {task.priority && (
              <div className="flex items-center gap-2 justify-start">
                <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Badge className={`${getPriorityColor()} capitalize`}>
                  {task.priority} Priority
                </Badge>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-start">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-left">
                  Due: {format(new Date(task.dueDate), "PPP")}
                </span>
              </div>
            )}
          </div>

          {/* Subtasks Section */}
          {subtasks.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-left">
              <h4 className="text-sm font-medium mb-1 text-left">
                Subtasks ({subtasks.length})
              </h4>
              <div className="pl-2 text-sm text-left">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-1 py-1 justify-start"
                  >
                    <div className="h-2 w-2 rounded-full bg-gray-300 flex-shrink-0"></div>
                    <span className="text-left">{subtask.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
