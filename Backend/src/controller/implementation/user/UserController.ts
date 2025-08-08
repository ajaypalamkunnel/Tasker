import { IUserService } from "../../../service/interface/IUserService";
import { IUserController } from "../../interface/user/IUserController";



class UserController implements IUserController {
    private _userService: IUserService;

    constructor(userService: IUserService) {
        this._userService = userService;
    }

}

export default UserController