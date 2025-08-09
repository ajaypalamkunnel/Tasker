import { PaginatedTasksResponseDTO } from "../../../dtos/responseDtos/dtos/task.dto";
import { ITask, TaskStatus, ITaskFilter, IPaginationParams, IPaginatedTasksResponse } from "../../../types/tasks.types";




export interface ITaskService {


    createTask(userId:string,taskData: Partial<ITask>): Promise<ITask>
    updateStatus(id:string,status:TaskStatus):Promise<ITask>
    editTask(taskData: Partial<ITask>): Promise<ITask>
    deleteTask(id:string):Promise<ITask>
    fetchTasksByUserId(userId: string, filter: ITaskFilter, pagination: IPaginationParams): Promise<PaginatedTasksResponseDTO>
   
    
}