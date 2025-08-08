import { Request, Response } from "express";
import { IUserService } from "../../../service/interface/IUserService";
import { ITaskService } from "../../../service/interface/Tasks/ITaskService";
import { ITaskController } from "../../interface/tasks/ITaskController";
import { ERROR_MESSAGES, StatusCode } from "../../../constants/statusCode";
import { CustomError } from "../../../utils/CustomError";


class TaskController implements ITaskController {
    private _taskService: ITaskService;
    private _userService: IUserService;

    constructor(articleService: ITaskService, userService: IUserService) {
        this._taskService = articleService;
        this._userService = userService;
    }

    addTask = async (req: Request, res: Response): Promise<Response> => {
        
        try {

            const userId = req.user?.userId
            const taskData = { ...req.body, userId: userId }

            console.log("==>",userId,taskData);
            
    
            const response = await this._taskService.createTask(userId!,taskData)
    
            return res.status(StatusCode.CREATED).json({
                success: true,
                message: "Task created successfully",
                data: response
            })
            
        } catch (error) {

            console.log("Task creation error", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );
            
        }
       



    }
        updateTaskStatus = async (req: Request, res: Response): Promise<Response> => {
        try {

            const {id} = req.params
            const {status} = req.body

            const response = await this._taskService.updateStatus(id,status)

            return res.status(StatusCode.OK).json({
                success: true,
            })
        } catch (error) {

            console.log("Task status update error", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );
            
        }
    }
    editTask = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const updateData = { ...req.body, _id: id };

            const response = await this._taskService.editTask(updateData);

            return res.status(StatusCode.OK).json({
                success: true,
                message: "Task updated successfully",
                data: response
            });
        } catch (error) {
            console.log("Task update error", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json({
                    success: false,
                    message: error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                });
        }
    }

    deleteTask = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;

            await this._taskService.deleteTask(id);

            return res.status(StatusCode.OK).json({
                success: true,
                message: "Task deleted successfully"
            });
        } catch (error) {
            console.log("Task deletion error", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json({
                    success: false,
                    message: error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                });
        }
    }

    fetchTasks = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = req.user?.userId;

            console.log("userId==",userId);
            
            
            // Get validated query parameters
            const page = (req.query as any).page || 1;
            const limit = (req.query as any).limit || 10;
            const status = (req.query as any).status;

            // Build filter object
            const filter: any = {};
            if (status) {
                filter.status = status;
            }

            console.log("filter==",filter);
            

            const response = await this._taskService.fetchTasksByUserId(userId!, filter, { page, limit });

            return res.status(StatusCode.OK).json({
                success: true,
                message: "Tasks fetched successfully",
                data: response
            });

        } catch (error) {
            console.log("Fetch tasks error", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json({
                    success: false,
                    message: error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                });
        }
    }
    
}

export default TaskController