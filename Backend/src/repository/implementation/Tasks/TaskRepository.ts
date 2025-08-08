import { TaskModel } from "../../../model/tasks/Task.model";
import { ITask } from "../../../types/tasks.types";
import { BaseRepository } from "../../base/BaseRepository";
import { ITaskRepository } from "../../interface/Tasks/ITaskRepository";



class TaskRepository extends BaseRepository<ITask> implements ITaskRepository{

    constructor() {
            super(TaskModel)
    }
    

}

export default TaskRepository