import { ITask, ITaskFilter, IPaginationParams, IPaginatedTasksResponse } from "../../../types/tasks.types";
import { IBaseRepository } from "../../base/IBaseRepository";



export interface ITaskRepository extends IBaseRepository<ITask>{
    fetchTasksByUserId(userId: string, filter: ITaskFilter, pagination: IPaginationParams): Promise<IPaginatedTasksResponse>;
}