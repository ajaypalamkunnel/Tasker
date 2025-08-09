import { UserModel } from "../../../model/user/User.model";
import { IUser } from "../../../types/user.types";
import { BaseRepository } from "../../base/BaseRepository";
import { IUserRepositroy } from "../../interface/User/IUserRepository";


class UserRepository extends BaseRepository<IUser> implements IUserRepositroy {

    constructor() {
        super(UserModel)
    }
    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email })
    }

    async updateRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(userId, { refreshToken });
    }

    async removeRefreshToken(refreshToken: string): Promise<void> {
        await UserModel.updateOne({ refreshToken }, { $unset: { refreshToken: 1 } })
    }


    async findUserTokenById(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId).select("-password");
    }

}


export default UserRepository