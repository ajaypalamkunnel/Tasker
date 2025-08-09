export type TaskStatus = "pending" | "in-progress" | "completed";

export interface ITask {
  _id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateTaskData {
  title: string;
  description: string;
  dueDate: string;
}

export interface IUpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface ITaskFilter {
  status?: TaskStatus;
}

export interface IPaginationParams {
  page: number;
  limit: number;
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginatedTasksResponse {
  success: boolean;
  message: string;
  data: {
    tasks: ITask[];
    pagination: IPagination;
  };
} 