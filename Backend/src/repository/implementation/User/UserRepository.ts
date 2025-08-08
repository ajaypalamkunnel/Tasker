import { UserModel } from "../../../model/user/User.model";
import { IUser } from "../../../types/user.types";
import { BaseRepository } from "../../base/BaseRepository";
import { IUserRepositroy } from "../../interface/User/IUserRepository";


class UserRepository extends BaseRepository<IUser> implements IUserRepositroy {

    constructor() {
        super(UserModel)
    }

}


export default UserRepository