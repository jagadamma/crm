import { create } from "zustand";
import axios from "axios";

export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done" | string;

export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  assignedTo: string;
  priority: Priority;
  tags: string[];
  status: Status;
  parentId?: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface TaskState {
  tasks: { [key: string]: Task };
  columns: Column[];
  fetchTasks: () => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  moveTask: (
    taskId: string,
    sourceColumn: string,
    destinationColumn: string
  ) => void;
}

const DEFAULT_COLUMNS = ["todo", "in-progress", "done"];

// API Base URL
const API_URL = `${process.env.REACT_APP_BASE_API_URL}api/`;
// const backendUrl = "https://task-manager-app-603782056306.us-central1.run.app";
const backendUrl = process.env.REACT_APP_BASE_API_URL;

export const useTaskStore = create<TaskState>((set) => ({
  tasks: {},
  columns: [
    { id: "todo", title: "Todo", taskIds: [] },
    { id: "in-progress", title: "In Progress", taskIds: [] },
    { id: "done", title: "Done", taskIds: [] },
  ],

  // Fetch tasks from backend
  fetchTasks: async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks/get`);
      const tasks: Task[] = response.data;
      const tasksMap: { [key: string]: Task } = {};
      tasks.forEach((task) => (tasksMap[task.id] = task));

      set((state) => {
        const updatedColumns = state.columns.map((column) => {
          const taskIdsForColumn = tasks
            .filter((task) => task.status === column.id)
            .map((task) => task.id);
          return { ...column, taskIds: taskIdsForColumn };
        });

        return { tasks: tasksMap, columns: updatedColumns };
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },

  addColumn: (title) => {
    set((state) => ({
      columns: [
        ...state.columns,
        { id: title.toLowerCase(), title, taskIds: [] },
      ],
    }));
  },

  deleteColumn: (columnId) => {
    if (DEFAULT_COLUMNS.includes(columnId)) return; // Prevent deletion of default columns

    set((state) => {
      // Find the column to delete and move its tasks to 'todo'
      const columnToDelete = state.columns.find((col) => col.id === columnId);
      if (!columnToDelete) return state;

      // Update tasks to set their status to 'todo'
      const updatedTasks = { ...state.tasks };
      columnToDelete.taskIds.forEach((taskId) => {
        if (updatedTasks[taskId]) {
          updatedTasks[taskId] = { ...updatedTasks[taskId], status: "todo" };
        }
      });

      // Remove the column and update task lists in other columns
      const updatedColumns = state.columns
        .filter((col) => col.id !== columnId)
        .map((col) => {
          if (col.id === "todo") {
            return {
              ...col,
              taskIds: [...col.taskIds, ...columnToDelete.taskIds],
            };
          }
          return col;
        });

      return { columns: updatedColumns, tasks: updatedTasks };
    });
  },

  moveTask: async (
    taskId: string,
    sourceColumn: string,
    destinationColumn: string
  ) => {
    try {
      await axios.put(`${API_URL}/tasks/move/${taskId}`, { destinationColumn });

      set((state) => {
        const updatedColumns = state.columns.map((column) => {
          if (column.id === sourceColumn) {
            return {
              ...column,
              taskIds: column.taskIds.filter((id) => id !== taskId),
            };
          }
          if (column.id === destinationColumn) {
            return { ...column, taskIds: [...column.taskIds, taskId] };
          }
          return column;
        });

        const updatedTasks = {
          ...state.tasks,
          [taskId]: { ...state.tasks[taskId], status: destinationColumn },
        };

        return { columns: updatedColumns, tasks: updatedTasks };
      });
    } catch (error) {
      console.error("Error moving task:", error);
    }
  },

  addTask: async (task) => {
    try {
      const response = await axios.post(`${backendUrl}/api/tasks/post`, task);
      const newTask = response.data;

      set((state) => {
        const updatedColumns = state.columns.map((column) => {
          if (column.id === newTask.status) {
            return { ...column, taskIds: [...column.taskIds, newTask.id] };
          }
          return column;
        });

        return {
          tasks: { ...state.tasks, [newTask.id]: newTask },
          columns: updatedColumns,
        };
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  },

  updateTask: async (id, updatedTask) => {
    try {
      await axios.put(`${backendUrl}/api/tasks/update/${id}`, updatedTask);
      set((state) => ({
        tasks: { ...state.tasks, [id]: { ...state.tasks[id], ...updatedTask } },
      }));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  },

  deleteTask: async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/tasks/delete/${id}`);
      set((state) => {
        const newTasks = { ...state.tasks };
        delete newTasks[id];

        // Update columns by removing taskId
        const updatedColumns = state.columns.map((column) => ({
          ...column,
          taskIds: column.taskIds.filter((taskId) => taskId !== id),
        }));

        return { tasks: newTasks, columns: updatedColumns };
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },
}));
