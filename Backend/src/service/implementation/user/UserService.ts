import { StatusCode } from "../../../constants/statusCode";
import { UserModel } from "../../../model/user/User.model";
import { IUserRepositroy } from "../../../repository/interface/User/IUserRepository";
import { IUser } from "../../../types/user.types";
import { CustomError } from "../../../utils/CustomError";
import JWTUtils from "../../../utils/jwtUtils";
import PasswordUtils from "../../../utils/PasswordUtils";
import { IUserService } from "../../interface/IUserService";



class UserService implements IUserService {
    private _userRepository: IUserRepositroy;

    constructor(userRepository: IUserRepositroy) {
        this._userRepository = userRepository;
    }

    async registration(userDetails: Partial<IUser>): Promise<{ user: IUser }> {
        try {
            const { name, email, password } = userDetails;



            const existingUser = await this._userRepository.findUserByEmail(email!);
            if (existingUser) {
                throw new CustomError("Email already exists", StatusCode.CONFLICT);
            }


            const hashedPassword = await PasswordUtils.hashPassword(password!);



            // ---- Create the user ---- 
            const user = await UserModel.create({
                name: name?.trim(),
                email: email?.toLowerCase(),
                password: hashedPassword,
                isVerified: true
            });

            return { user: user as IUser };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(
                "Registration Error",
                StatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
    async loginUser(email: string, password: string): Promise<{ user: IUser | null; accessToken: string; refreshToken: string; }> {
        try {


            const user = await this._userRepository.findUserByEmail(email)

            if (!user) {
                throw new CustomError("Invalid email or password.", StatusCode.BAD_REQUEST)
            }


            if (!user.isVerified) {
                throw new CustomError("signup not completed", StatusCode.BAD_REQUEST)
            }

            const isMatch = await PasswordUtils.comparePassword(
                password,
                user.password
            )

            if (!isMatch) {
                throw new CustomError("Invalid email or password.", StatusCode.BAD_REQUEST)
            }

            const accessToken = JWTUtils.generateAccessToken({
                userId: user._id,
                email: user.email
            })


            const refreshToken = JWTUtils.generateRefreshToken({ userId: user._id })



            await this._userRepository.updateRefreshToken(
                user._id.toString(),
                refreshToken
            )



            return { accessToken, refreshToken, user }




        } catch (error) {

            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(
                    "Login service error",
                    StatusCode.INTERNAL_SERVER_ERROR
                );
            }

        }
    }


    async logoutUser(refreshToken: string): Promise<void> {
        await this._userRepository.removeRefreshToken(refreshToken)
    }

    async renewAuthTokens(oldRefreshToken: string): Promise<{ accessToken: string; }> {
        const decode = JWTUtils.verifyToken(oldRefreshToken, true)

        if (!decode || typeof decode === "string" || !decode.userId) {
            throw new Error("Invalid refresh token");
        }

        const user = await this._userRepository.findUserTokenById(decode.userId.toString())

        if (!user || user.refreshToken !== oldRefreshToken) {
            throw new Error("Invalid refresh token");
        }

        const newAccessToken = JWTUtils.generateAccessToken({
            userId: user?._id,
            email: user?.email,

        });

        return { accessToken: newAccessToken };
    }




}

export default UserService