import { ObjectId, Types } from "mongoose";

export interface TaskDTO {
    _id: string | Types.ObjectId;
    userId: string | Types.ObjectId;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    dueDate: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface PaginatedTasksResponseDTO {
    tasks: TaskDTO[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalTasks: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
