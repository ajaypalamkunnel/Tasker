import { ITaskRepository } from "../../../repository/interface/Tasks/ITaskRepository";
import { IUserRepositroy } from "../../../repository/interface/User/IUserRepository";
import { ITaskService } from "../../interface/Tasks/ITaskService";



class TaskService implements ITaskService {
    private _userRepository: IUserRepositroy;
     private _articleRepository: ITaskRepository
    constructor(taskRepository:ITaskRepository,userRepository: IUserRepositroy) {
        this._userRepository = userRepository;
        this._articleRepository = taskRepository
    }

}

export default TaskService