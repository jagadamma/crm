import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, X } from "lucide-react";
import { useTaskStore, Task } from "@/store/taskStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import TaskForm from "./TaskForm";
import { Badge } from "@/components/ui/badge";
import { SortableTask } from "./SortableTask";

const DEFAULT_COLUMNS = ["todo", "in-progress", "done"];

const isTask = (value: unknown): value is Task => {
  return value !== null && typeof value === "object" && "id" in value;
};

// New component for droppable empty column area
const DroppableColumn: React.FC<{ id: string }> = ({ id }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef} 
      className="min-h-24 w-full rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400"
    >
      Drop task here
    </div>
  );
};

export const KanbanBoard: React.FC = () => {
  const {
    columns,
    tasks,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    deleteColumn,
    fetchTasks,
    addTask,
  } = useTaskStore();

  const [newColumnTitle, setNewColumnTitle] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTasks();
    const intervalId = setInterval(fetchTasks, 1000);
    return () => clearInterval(intervalId);
  }, [fetchTasks]);


  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    if (taskId === overId) return;

    const activeTask = tasks[taskId];
    if (!activeTask) return;

    const sourceColumn = activeTask.status;
    const isOverAColumn = columns.some((col) => col.id === overId);

    if (isOverAColumn) {
      const destinationColumn = overId;
      if (sourceColumn !== destinationColumn) {
        moveTask(taskId, sourceColumn, destinationColumn);
      }
    } else {
      const overTask = tasks[overId];
      if (!overTask) return;

      const destinationColumn = overTask.status;
      if (sourceColumn !== destinationColumn) {
        moveTask(taskId, sourceColumn, destinationColumn);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks[activeId];
    if (!activeTask) return;

    const isOverAColumn = columns.some((col) => col.id === overId);
    if (isOverAColumn && activeTask.status !== overId) {
      // Visual updates handled by dnd-kit
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle("");
    }
  };

  const getSubtasks = (taskId: string) => {
    return Object.values(tasks).filter((value): value is Task => {
      if (!isTask(value)) return false;
      return value.parentId === taskId;
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm
                onSubmit={(data) => {
                  addTask(data);
                  setIsDialogOpen(false);
                }}
                initialValues={undefined}
                parentId={undefined}
              />
            </DialogContent>
          </Dialog>
          <div className="flex items-center gap-2">
            <Input
              placeholder="New column name"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="max-w-[200px]"
            />
            <Button onClick={handleAddColumn} variant="outline">
              Add Column
            </Button>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div 
              key={column.id} 
              className="kanban-column min-w-72 bg-gray-50 rounded-md p-3" 
              id={column.id}
            >
              <div className="kanban-column-header mb-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{column.title}</span>
                    <Badge variant="secondary">{column.taskIds.length}</Badge>
                  </div>
                  {!DEFAULT_COLUMNS.includes(column.id) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Column</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this column? All
                            tasks will be moved to the Todo column.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteColumn(column.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>

              <SortableContext
                items={column.taskIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2 p-2">
                  {column.taskIds.length > 0 ? (
                    column.taskIds.map((taskId) => {
                      const task = tasks[taskId];
                      if (!task) return null;

                      return (
                        <SortableTask
                          key={task.id}
                          task={task}
                          getSubtasks={getSubtasks}
                          updateTask={updateTask}
                          deleteTask={deleteTask}
                          setIsDialogOpen={setIsDialogOpen}
                        />
                      );
                    })
                  ) : (
                    <DroppableColumn id={column.id} />
                  )}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeId && tasks[activeId] ? (
            <div className="kanban-task p-3 rounded border bg-white shadow-sm opacity-80">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-medium">{tasks[activeId].title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tasks[activeId].description}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};