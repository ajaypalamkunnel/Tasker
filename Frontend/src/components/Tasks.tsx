import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Calendar,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchTasks,
  deleteTask,
  updateTaskStatus,
} from "../services/userService";
import type { ITask, TaskStatus } from "../types/task";
import { formatDate } from "../utils/dataFormate";
import ConfirmationModal from "./ConfirmationModal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

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
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const response = await deleteTask(taskToDelete);

      if (response.success) {
        toast.success("Task deleted successfully");
        loadTasks(currentPage); // Refresh the current page
      } else {
        toast.error(response.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setTaskToDelete(null);
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
          color: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 shadow-sm",
        },
        {
          value: "in-progress",
          label: "In Progress",
          color: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 shadow-sm",
        },
        {
          value: "completed",
          label: "Completed",
          color: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 shadow-sm",
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
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-200 transform hover:scale-105 ${
            currentStatus?.color || "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200 shadow-sm"
          } hover:shadow-md disabled:opacity-50 disabled:transform-none`}
        >
          <span>{currentStatus?.label || task.status.replace("-", " ")}</span>
          {updatingStatus === task._id ? (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl z-20 min-w-[160px] overflow-hidden backdrop-blur-sm">
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
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r ${
                  option.value === task.status
                    ? "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-l-4 border-indigo-500"
                    : "text-gray-700 hover:from-gray-50 hover:to-slate-50 hover:text-gray-900"
                } disabled:opacity-50 first:rounded-t-xl last:rounded-b-xl`}
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
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Enhanced Filter Section - Always visible */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Filter Tasks</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                filter === "all"
                  ? "bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg"
                  : "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 hover:from-gray-100 hover:to-slate-100 border border-gray-200"
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                filter === "pending"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg"
                  : "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 hover:from-amber-100 hover:to-yellow-100 border border-amber-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("in-progress")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                filter === "in-progress"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                  : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                filter === "completed"
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                  : "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 hover:from-emerald-100 hover:to-green-100 border border-emerald-200"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gradient-to-r from-blue-400 to-indigo-500 border-t-transparent"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 border-4 border-blue-200 opacity-30"></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Enhanced Filter Section - Always visible */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Filter Tasks</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              filter === "all"
                ? "bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg"
                : "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 hover:from-gray-100 hover:to-slate-100 border border-gray-200"
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              filter === "pending"
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg"
                : "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 hover:from-amber-100 hover:to-yellow-100 border border-amber-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              filter === "in-progress"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              filter === "completed"
                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                : "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 hover:from-emerald-100 hover:to-green-100 border border-emerald-200"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Task List or Empty State */}
      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-2xl border border-gray-100">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ListTodo className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No tasks found</h3>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            {filter !== "all"
              ? `No ${filter.replace("-", " ")} tasks available`
              : "Ready to get organized? Create your first task and start achieving your goals!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task, index) => (
            <div
              key={task._id}
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {task.title}
                    </h3>
                    <StatusDropdown task={task} />
                  </div>

                  <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
                    {task.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
                      <Calendar className="w-4 h-4 text-rose-600" />
                      <span className="font-medium text-rose-700">Due: {formatDate(task.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <span className="font-medium text-slate-700">Created: {formatDate(task.createdAt || "")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 lg:flex-col lg:gap-2">
                  <button
                    onClick={() => onEditTask(task)}
                    className="flex items-center justify-center p-3 text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 transition-all duration-200 transform hover:scale-110 hover:shadow-md group/btn"
                    title="Edit task"
                  >
                    <Edit className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-200" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="flex items-center justify-center p-3 text-red-600 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 rounded-xl border border-red-200 transition-all duration-200 transform hover:scale-110 hover:shadow-md group/btn"
                    title="Delete task"
                  >
                    <Trash2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-gray-600 bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-2 rounded-xl border border-gray-200">
              Showing <span className="font-bold text-gray-800">{(currentPage - 1) * 5 + 1}</span> to{" "}
              <span className="font-bold text-gray-800">{Math.min(currentPage * 5, totalTasks)}</span> of{" "}
              <span className="font-bold text-blue-600">{totalTasks}</span> tasks
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl hover:from-gray-100 hover:to-slate-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
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
                      className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 transform hover:scale-110 ${
                        page === currentPage
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                          : "text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 hover:from-gray-100 hover:to-slate-100 hover:shadow-md"
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl hover:from-gray-100 hover:to-slate-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDeleteTask}
        title="Confirm Deletion"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default TaskList;