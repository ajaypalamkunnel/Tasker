import { Request, Response } from "express";

export interface ITaskController {
    addTask(req: Request, res: Response): Promise<Response>;
    updateTaskStatus(req: Request, res: Response): Promise<Response>;
    editTask(req: Request, res: Response): Promise<Response>;
    deleteTask(req: Request, res: Response): Promise<Response>;
    fetchTasks(req: Request, res: Response): Promise<Response>;
}