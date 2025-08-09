import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Calendar,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchTasks,
  deleteTask,
  updateTaskStatus,
} from "../services/userService";
import type { ITask, TaskStatus } from "../types/task";
import { formatDate } from "../utils/dataFormate";

interface TaskListProps {
  onEditTask: (task: ITask) => void;
  refreshTrigger: number;
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask, refreshTrigger }) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const loadTasks = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetchTasks(
        filter !== "all" ? { status: filter } : undefined,
        { page, limit: 5 }
      );

      

      if (response.success && response.data) {
        // Handle nested data structure
        const tasksData = response.data;
        setTasks(tasksData.data.tasks || []);
        setTotalPages(Number(tasksData.data.pagination?.totalPages) || 1);
        setTotalTasks(Number(tasksData.data.pagination?.totalTasks) || 0);
        setCurrentPage(Number(tasksData.data.pagination?.currentPage) || 1);
      } else {
        toast.error(response.message || "Failed to load tasks");
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(1);
  }, [refreshTrigger, filter]);

  const handlePageChange = (newPage: number) => {
    console.log("handlePageChange called with:", newPage);
    console.log("current totalPages:", totalPages, "type:", typeof totalPages);
    console.log("condition check:", newPage >= 1 && newPage <= totalPages);
    
    if (newPage >= 1 && newPage <= totalPages) {
      console.log("Loading page:", newPage);
      setCurrentPage(newPage);
      loadTasks(newPage);
    } else {
      console.log("Page change rejected:", { newPage, totalPages });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await deleteTask(taskId);

      if (response.success) {
        toast.success("Task deleted successfully");
        loadTasks(currentPage); // Refresh the current page
      } else {
        toast.error(response.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
    try {
      setUpdatingStatus(taskId);
      const response = await updateTaskStatus(taskId, newStatus);

      if (response.success) {
        toast.success("Task status updated successfully");
        // Update the task in the local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        toast.error(response.message || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const StatusDropdown: React.FC<{ task: ITask }> = ({ task }) => {
    const [isOpen, setIsOpen] = useState(false);

    const statusOptions: { value: TaskStatus; label: string; color: string }[] =
      [
        {
          value: "pending",
          label: "Pending",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        },
        {
          value: "in-progress",
          label: "In Progress",
          color: "bg-blue-100 text-blue-800 border-blue-200",
        },
        {
          value: "completed",
          label: "Completed",
          color: "bg-green-100 text-green-800 border-green-200",
        },
      ];

    const currentStatus = statusOptions.find(
      (option) => option.value === task.status
    );

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest(".status-dropdown")) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    return (
      <div className="relative status-dropdown">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={updatingStatus === task._id}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            currentStatus?.color || "bg-gray-100 text-gray-800 border-gray-200"
          } hover:opacity-80 disabled:opacity-50`}
        >
          <span>{currentStatus?.label || task.status.replace("-", " ")}</span>
          {updatingStatus === task._id ? (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  if (option.value !== task.status) {
                    handleStatusUpdate(task._id, option.value);
                  }
                  setIsOpen(false);
                }}
                disabled={updatingStatus === task._id}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  option.value === task.status
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                } disabled:opacity-50`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No tasks found</p>
        <p className="text-gray-400 text-sm mt-2">
          {filter !== "all"
            ? `No ${filter} tasks`
            : "Create your first task to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === "pending"
              ? "bg-yellow-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("in-progress")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === "in-progress"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === "completed"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <StatusDropdown task={task} />
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">
                  {task.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Created: {formatDate(task.createdAt || "")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onEditTask(task)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit task"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages >= 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 5 + 1} to{" "}
            {Math.min(currentPage * 5, totalTasks)} of {totalTasks} tasks
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Debug info - remove this after testing */}
      
    </div>
  );
};

export default TaskList;
