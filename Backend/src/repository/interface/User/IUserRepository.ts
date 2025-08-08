import { IUser } from "../../../types/user.types";
import { IBaseRepository } from "../../base/IBaseRepository";


export interface IUserRepositroy extends IBaseRepository<IUser> {

    findUserByEmail(email: string): Promise<IUser | null>;
     updateRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<IUser | null>;
    removeRefreshToken(refreshToken: string): Promise<void>;
    findUserTokenById(userId: string): Promise<IUser | null>;
}