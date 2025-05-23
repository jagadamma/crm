import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Task, Priority, useTaskStore } from "@/store/taskStore";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "sonner";

interface TaskFormProps {
  onSubmit: (data: Omit<Task, "id">) => void;
  initialValues?: Task;
  parentId?: string;
  onClose?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialValues,
  parentId: defaultParentId,
  onClose,
}) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialValues?.startDate ? new Date(initialValues.startDate) : undefined
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialValues?.dueDate ? new Date(initialValues.dueDate) : undefined
  );
  const [assignedTo, setAssignedTo] = useState(initialValues?.assignedTo || "");
  const [priority, setPriority] = useState<Priority>(
    initialValues?.priority || "medium"
  );
  const [tags, setTags] = useState(
    Array.isArray(initialValues?.tags)
      ? initialValues.tags.join(", ")
      : initialValues?.tags || ""
  );
  const [status, setStatus] = useState(initialValues?.status || "Todo");
  const [parentId, setParentId] = useState(
    defaultParentId || initialValues?.parentId || "none"
  );
  const [loading, setLoading] = useState(false);
  const [parentTasks, setParentTasks] = useState<Task[]>([]);
  const { columns } = useTaskStore();

  useEffect(() => {
    fetch(`api/tasks/get`)
      .then((response) => response.json())
      .then((data) => {
        let filteredTasks = data.filter((task: Task) => !task.parentId);
        if (initialValues) {
          filteredTasks = filteredTasks.filter(
            (task: { id: string }) => task.id !== initialValues.id
          );
        }
        setParentTasks(filteredTasks);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !dueDate || dueDate < startDate) {
      toast.error(
        "Invalid dates. Ensure the due date is after the start date."
      );
      return;
    }

    if (loading) return;
    setLoading(true);

    const taskData = {
      title,
      description,
      startDate: format(startDate, "yyyy-MM-dd HH:mm:ss"),
      dueDate: format(dueDate, "yyyy-MM-dd HH:mm:ss"),
      assignedTo,
      priority,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: status.trim(),
      ...(parentId !== "none" && { parentId }),
    };

    try {
      let response;
      if (initialValues?.id) {
        response = await axios.put(
          `api/tasks/update/${initialValues.id}`,
          taskData
        );
      } else {
        response = await axios.post(`api/tasks/post`, taskData);
      }

      toast.success(
        `Task ${initialValues ? "updated" : "created"} successfully!`
      );
      onSubmit(response.data);
      if (onClose) onClose();
    } catch (error) {
      toast.error("Error saving task");
      console.error("❌ Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[800px] max-h-[90vh] overflow-y-auto bg-white dark:bg-black p-4 space-y-6 rounded-md shadow-md">
      {onClose && (
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {initialValues ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 dark:bg-gray-900 w-full"
              />
            </div>

            <div>
              <Label htmlFor="assignedTo" className="font-medium">
                Assigned To
              </Label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                className="mt-1 dark:bg-gray-900 w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 dark:bg-gray-900 w-full"
              rows={4}
            />
          </div>
        </div>

        {/* Dates Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Dates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="font-medium">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1 dark:bg-gray-900"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    required
                    disabled={false}
                    defaultMonth={startDate || new Date()}
                    toDate={dueDate}
                    captionLayout="dropdown"
                    fromDate={new Date()}
                    fixedWeeks
                    className="rounded-md border dark:bg-gray-900"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="font-medium">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1 dark:bg-gray-900"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      format(dueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    required
                    disabled={false}
                    defaultMonth={dueDate || startDate || new Date()}
                    fromDate={startDate || new Date()}
                    captionLayout="dropdown"
                    fixedWeeks
                    className="rounded-md border dark:bg-gray-900"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Task Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Task Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="priority" className="font-medium">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(value: Priority) => setPriority(value)}
              >
                <SelectTrigger className="mt-1 dark:bg-gray-900 w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status" className="font-medium">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1 dark:bg-gray-900 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900">
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor="parentTask" className="font-medium">
                Parent Task (Optional)
              </Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger className="mt-1 dark:bg-gray-900 w-full">
                  <SelectValue placeholder="Select parent task (optional)" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900">
                  <SelectItem value="none">No Parent Task</SelectItem>
                  {parentTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor="tags" className="font-medium">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="mt-1 dark:bg-gray-900 w-full"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6 py-6 text-lg"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : initialValues
            ? "Update Task"
            : "Create Task"}
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
