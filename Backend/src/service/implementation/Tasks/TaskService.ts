import { Types } from "mongoose";
import { StatusCode } from "../../../constants/statusCode";
import { ITaskRepository } from "../../../repository/interface/Tasks/ITaskRepository";
import { IUserRepositroy } from "../../../repository/interface/User/IUserRepository";
import { ITask, TaskStatus, ITaskFilter, IPaginationParams, IPaginatedTasksResponse } from "../../../types/tasks.types";
import { CustomError } from "../../../utils/CustomError";
import { ITaskService } from "../../interface/Tasks/ITaskService";
import { TaskMapper } from "../../../dtos/responseDtos/mapper/task.mapper";
import { PaginatedTasksResponseDTO } from "../../../dtos/responseDtos/dtos/task.dto";



class TaskService implements ITaskService {
    
    private _taskRepository: ITaskRepository
    constructor(taskRepository: ITaskRepository,) {
        
        this._taskRepository = taskRepository
    }

    async createTask(userId: string, taskData: Partial<ITask>): Promise<ITask> {

        try {
           
            const taskWithUser = {
                ...taskData,
                userId: new Types.ObjectId(userId)
            };

            console.log("==>",taskWithUser);
            
            const task = await this._taskRepository.create(taskWithUser);

            return task


        } catch (error) {

            throw new CustomError("Failed to create task", StatusCode.INTERNAL_SERVER_ERROR)
        }

    }
    
    async updateStatus(id: string, status: TaskStatus): Promise<ITask> {

        try {

            const task = await this._taskRepository.update(id, { status });

            if (!task) {
                throw new CustomError("Task not found", StatusCode.NOT_FOUND);
            }

            return task;
        } catch (error) {
            throw new CustomError("Failed to update task status", StatusCode.INTERNAL_SERVER_ERROR);
        }
    }


    async editTask(taskData: Partial<ITask>): Promise<ITask> {
        try {
            if (!taskData._id) {
                throw new CustomError("Task ID is required", StatusCode.BAD_REQUEST);
            }

            const task = await this._taskRepository.update(taskData._id.toString(), taskData);

            if (!task) {
                throw new CustomError("Task not found", StatusCode.NOT_FOUND);
            }

            return task;


        } catch (error) {

            throw new CustomError("Failed to update task", StatusCode.INTERNAL_SERVER_ERROR);

        }
    }

    async deleteTask(id: string): Promise<ITask> {
        try {

            const task = await this._taskRepository.delete(id);

            if (!task) {
                throw new CustomError("Task not found", StatusCode.NOT_FOUND);
            }

            return task;

        } catch (error) {

            throw new CustomError("Failed to delete task", StatusCode.INTERNAL_SERVER_ERROR);

        }
    }

    async fetchTasksByUserId(userId: string, filter: ITaskFilter, pagination: IPaginationParams): Promise<PaginatedTasksResponseDTO> {
        try {
           
            if (pagination.page < 1) {
                throw new CustomError("Page number must be greater than 0", StatusCode.BAD_REQUEST);
            }
            if (pagination.limit < 1 || pagination.limit > 100) {
                throw new CustomError("Limit must be between 1 and 100", StatusCode.BAD_REQUEST);
            }

            // Validate status filter if provided
            if (filter.status && !["pending", "in-progress", "completed"].includes(filter.status)) {
                throw new CustomError("Invalid status filter", StatusCode.BAD_REQUEST);
            }

            const result = await this._taskRepository.fetchTasksByUserId(userId, filter, pagination);

            if(!result){
                throw new CustomError("No tasks found", StatusCode.NOT_FOUND);
            }

           
            
            return TaskMapper.toPaginatedTasksDTO(result)

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError("Failed to fetch tasks", StatusCode.INTERNAL_SERVER_ERROR);
        }
    }






}

export default TaskService