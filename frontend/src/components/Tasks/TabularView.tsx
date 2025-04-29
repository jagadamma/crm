import React, { useEffect, useState, useMemo, useRef } from "react";
import { Plus, Edit, Trash, ChevronRight, ChevronDown } from "lucide-react";
import { useTaskStore, Task } from "@/store/taskStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Badge } from "@/components/ui/badge";
import TaskForm from "./TaskForm";
import { format } from "date-fns";



export const TabularView: React.FC = () => {
  const { updateTask, deleteTask } = useTaskStore();
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`api/tasks/get`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const tasksMap: Record<string, Task> = {};
          data.forEach((task: Task) => {
            tasksMap[task.id] = task;
          });
          setTasks((prev) =>
            JSON.stringify(prev) !== JSON.stringify(tasksMap) ? tasksMap : prev
          );
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
    intervalRef.current = setInterval(fetchTasks, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const rootTasks = useMemo(
    () => Object.values(tasks).filter((task) => !task.parentId),
    [tasks]
  );

  const getSubtasks = (taskId: string): Task[] => {
    return Object.values(tasks).filter((task) => task.parentId === taskId);
  };

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      newSet.has(taskId) ? newSet.delete(taskId) : newSet.add(taskId);
      return newSet;
    });
  };

  const formatDueDate = (dueDate?: string) =>
    dueDate ? format(new Date(dueDate), "PP") : "No Due Date";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tabular View</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Task</SheetTitle>
            </SheetHeader>
            <TaskForm onSubmit={(data) => console.log("Adding Task:", data)} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rootTasks.map((task) => {
              const subtasks = getSubtasks(task.id);
              const isExpanded = expandedTasks.has(task.id);
              const taskList: Task[] = [task, ...(isExpanded ? subtasks : [])];

              return (
                <React.Fragment key={task.id}>
                  {taskList.map((item) => (
                    <TableRow
                      key={item.id}
                      className={item.parentId ? "bg-gray-100" : ""}
                    >
                      <TableCell>
                        {item === task && subtasks.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleExpanded(task.id)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.priority === "high"
                              ? "destructive"
                              : item.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDueDate(item.dueDate)}</TableCell>
                      <TableCell>{item.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(item.tags)
                            ? item.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))
                            : typeof item.tags === "string" && item.tags
                              ? (item.tags as string).trim().length > 0
                                ? (item.tags as string).split(",").map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag.trim()}
                                  </Badge>
                                ))
                                : null
                              : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setEditingTask(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Edit Task</SheetTitle>
                            </SheetHeader>
                            {editingTask && (
                              <TaskForm
                                initialValues={editingTask}
                                onSubmit={(updatedData) => {
                                  updateTask(editingTask.id, updatedData);
                                }}
                              />
                            )}
                          </SheetContent>
                        </Sheet>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the task.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTask(item.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};