import { TaskModel } from "../../../model/tasks/Task.model";
import { ITask, ITaskFilter, IPaginationParams, IPaginatedTasksResponse } from "../../../types/tasks.types";
import { BaseRepository } from "../../base/BaseRepository";
import { ITaskRepository } from "../../interface/Tasks/ITaskRepository";
import { Types } from "mongoose";



class TaskRepository extends BaseRepository<ITask> implements ITaskRepository{

    constructor() {
            super(TaskModel)
    }

    async fetchTasksByUserId(userId: string, filter: ITaskFilter, pagination: IPaginationParams): Promise<IPaginatedTasksResponse> {
        try {
            const { page, limit } = pagination;
            const skip = (page - 1) * limit;

            // Build query filter
            const queryFilter: any = {
                userId: new Types.ObjectId(userId)
            };

            console.log("queryFilter==",queryFilter);
            

            // Add status filter if provided
            if (filter.status) {
                queryFilter.status = filter.status;
            }

            console.log("fileter==",filter.status);
            

            // Get total count for pagination
            const totalTasks = await TaskModel.countDocuments(queryFilter);
            const totalPages = Math.ceil(totalTasks / limit);

            // Fetch tasks with pagination
            const tasks = await TaskModel
                .find(queryFilter)
                .sort({ createdAt: -1 }) // Sort by newest first
                .skip(skip)
                .limit(limit)
                .exec();

            console.log("Fetched tasks:", tasks);

            return {
                tasks,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalTasks,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            console.error("TaskRepository fetchTasksByUserId error:", error);
            throw new Error("Failed to fetch tasks");
        }
    }

    

}

export default TaskRepository