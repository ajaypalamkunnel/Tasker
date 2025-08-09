import { IUser } from "../../types/user.types";


export interface IUserService {

    registration(userDetails: Partial<IUser>): Promise<{ user: IUser }>
    loginUser(
        email: string,
        password: string
    ): Promise<{
        user: IUser | null;
        accessToken: string;
        refreshToken: string;
    }>

    logoutUser(refreshToken: string): Promise<void>;
    renewAuthTokens(token: string): Promise<{ accessToken: string }>;
}