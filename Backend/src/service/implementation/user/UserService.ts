import { IUserRepositroy } from "../../../repository/interface/User/IUserRepository";
import { IUserService } from "../../interface/IUserService";



class UserService implements IUserService {
    private _userRepository: IUserRepositroy;

    constructor(userRepository: IUserRepositroy) {
        this._userRepository = userRepository;
    }

}

export default UserService