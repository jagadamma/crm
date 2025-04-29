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

// const backendUrl = "https://task-manager-app-603782056306.us-central1.run.app";
const backendUrl = "http://localhost:5000";

interface TaskFormProps {
  onSubmit: (data: Omit<Task, "id">) => void;
  initialValues?: Task;
  parentId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialValues,
  parentId: defaultParentId,
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
  const [assignedTo, setAssignedTo] = useState(
    initialValues?.assignedTo || ""
  );
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
  const { columns } = useTaskStore(); // ✅ only columns used now

  useEffect(() => {
    fetch(`${backendUrl}/api/tasks/get`)
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
      alert("Invalid dates. Ensure the due date is after the start date.");
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
          `${backendUrl}/api/tasks/update/${initialValues.id}`,
          taskData
        );
      } else {
        response = await axios.post(`${backendUrl}/api/tasks/post`, taskData);
      }

      console.log("✅ Task saved successfully:", response.data);
      onSubmit(response.data);
    } catch (error) {
      console.error("❌ Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto px-1"
    >
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
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
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
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
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={priority}
          onValueChange={(value: Priority) => setPriority(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column.id} value={column.id}>
                {column.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="parentTask">Parent Task (Optional)</Label>
        <Select value={parentId} onValueChange={setParentId}>
          <SelectTrigger>
            <SelectValue placeholder="Select parent task (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Parent Task</SelectItem>
            {parentTasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? "Submitting..."
          : initialValues
            ? "Update Task"
            : "Create Task"}
      </Button>
    </form>
  );
};

export default TaskForm;
