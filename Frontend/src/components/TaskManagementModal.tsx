import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, FileText, Type } from 'lucide-react';
import { toast } from 'react-toastify';
import { createTask, updateTask } from '../services/userService';
import type { ITask, ICreateTaskData, IUpdateTaskData } from '../types/task';

interface TaskManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: ITask | null;
  onTaskSaved: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
}

const TaskManagementModal: React.FC<TaskManagementModalProps> = ({
  isOpen,
  onClose,
  task,
  onTaskSaved
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<TaskFormData>();

  const isEditMode = !!task;

  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Edit mode - populate form with existing task data
        setValue('title', task.title);
        setValue('description', task.description);
        setValue('dueDate', task.dueDate.split('T')[0]); // Convert ISO date to YYYY-MM-DD format
      } else {
        // Add mode - reset form
        reset();
      }
    }
  }, [isOpen, task, setValue, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (isEditMode && task) {
        // Update existing task
        const updateData: IUpdateTaskData = {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate
        };
        
        const response = await updateTask(task._id, updateData);
        
        if (response.success) {
          toast.success('Task updated successfully!');
          onTaskSaved();
          onClose();
        } else {
          toast.error(response.message || 'Failed to update task');
        }
      } else {
        // Create new task
        const createData: ICreateTaskData = {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate
        };
        
        const response = await createTask(createData);
        
        if (response.success) {
          toast.success('Task created successfully!');
          onTaskSaved();
          onClose();
        } else {
          toast.error(response.message || 'Failed to create task');
        }
      }
    } catch (error) {
      console.error('Task operation error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Type className="w-4 h-4" />
              Task Title
            </label>
            <input
              type="text"
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Title must be less than 100 characters'
                }
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter task title..."
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters'
                },
                maxLength: {
                  value: 500,
                  message: 'Description must be less than 500 characters'
                }
              })}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter task description..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Due Date Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4" />
              Due Date
            </label>
            <input
              type="date"
              {...register('dueDate', {
                required: 'Due date is required',
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  if (selectedDate < today) {
                    return 'Due date cannot be in the past';
                  }
                  return true;
                }
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.dueDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskManagementModal;
