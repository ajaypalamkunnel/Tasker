
import { Document, Types } from "mongoose";

export type TaskStatus = "pending" | "in-progress" | "completed";

export interface ITask extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId; 
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITaskFilter {
  status?: TaskStatus;
}

export interface IPaginationParams {
  page: number;
  limit: number;
}

export interface IPaginatedTasksResponse {
  tasks: ITask[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
