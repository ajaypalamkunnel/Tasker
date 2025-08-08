import { IUserService } from "../../../service/interface/IUserService";
import { ITaskService } from "../../../service/interface/Tasks/ITaskService";
import { ITaskController } from "../../interface/tasks/ITaskController";


class TaskController implements ITaskController {
    private _articleService: ITaskService;
    private _userService: IUserService;

    constructor(articleService: ITaskService, userService: IUserService) {
        this._articleService = articleService;
        this._userService = userService;
    }
}

export default TaskController