import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskManagementModal from '../components/TaskManagementModal';
import TaskList from '../components/Tasks';
import type { ITask } from '../types/task';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: ITask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskSaved = () => {
    // Trigger refresh of the task list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            <button
              onClick={handleAddTask}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Tasks</h2>
          <TaskList 
            onEditTask={handleEditTask}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>

      {/* Task Management Modal */}
      <TaskManagementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
};

export default Home;