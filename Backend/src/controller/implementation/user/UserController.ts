import { Request, Response } from "express";
import { IUserService } from "../../../service/interface/IUserService";
import { IUserController } from "../../interface/user/IUserController";
import { RegisterDto } from "../../../dtos/requestdtos/register.dto";
import { ERROR_MESSAGES, StatusCode } from "../../../constants/statusCode";
import { CustomError } from "../../../utils/CustomError";
import { config } from "../../../config/env";

class UserController implements IUserController {
    private _userService: IUserService;

    constructor(userService: IUserService) {
        this._userService = userService;
    }
    
    registerUser = async (req: Request, res: Response): Promise<Response>=>{

        try {

            const { name, email, password } = req.body as RegisterDto;

            const {user} = await this._userService.registration({
                name,
                email,
                password,
            })

              return res.status(StatusCode.CREATED).json({
                message: "User registered successfully",
                userId: user._id,
            });


            
        } catch (error) {

            console.error("Registration error:", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json({
                    error:
                        error instanceof CustomError
                            ? error.message
                            : "Internal server error",
                });
            
        }
        
    }
    resendOtp(req: Request, res: Response): Promise<Response> {
        throw new Error("Method not implemented.");
    }
    verifyOtp(req: Request, res: Response): Promise<Response> {
        throw new Error("Method not implemented.");
    }
    postLogin = async (req: Request, res: Response): Promise<Response> => {
        try {

            const { email, password } = req.body
            console.log(req.body);
            

            if (!email || !password) {
                return res
                    .status(StatusCode.BAD_REQUEST)
                    .json({ error: "Email and Password are required" });
            }

            const { accessToken, refreshToken, user } = await this._userService.loginUser(email, password)
            const isProduction = config.nodeEnv === "production";

            console.log("env status : ", isProduction);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"
            });


            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"
            });

            return res.status(StatusCode.OK).json({
                success: true,
                message: "Login succesful",
                accessToken,
                user: {
                    id: user?._id,
                    email: user?.email,
                    isVerified: user?.isVerified,
                    name: user?.name,
                },
            })
        } catch (error) {
            console.log("===>", error);


            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );

        }
    }


    logout = async (req: Request, res: Response): Promise<Response> => {
        try {
            console.log("My cookie : ", req.cookies);
            const refreshToken = req.cookies?.["refreshToken"]

            console.log("refresh token :", refreshToken);

            if (!refreshToken) {
                return res
                    .status(StatusCode.BAD_REQUEST)
                    .json({ error: "No refresh token provided" });
            }

            await this._userService.logoutUser(refreshToken)

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"

            })


            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"

            })

            return res
                .status(StatusCode.OK)
                .json({ success: true, message: "Logout successful" });

        } catch (error) {
            console.error("Logout failed", error);

            return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Logout failed" });
        }
    }

     renewAuthTokens = async (req: Request, res: Response): Promise<void> => {
        try {

            const oldRefreshToken = req.cookies?.["refreshToken"]

            if (!oldRefreshToken) {
                res
                    .status(StatusCode.UNAUTHORIZED)
                    .json({ error: "Refresh token not found" });
                return;
            }

            const { accessToken } = await this._userService.renewAuthTokens(
                oldRefreshToken
            );

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"
            });
            res.status(StatusCode.OK).json({ success: true, accessToken });


        } catch (error) {
            res.status(StatusCode.BAD_REQUEST).json({
                error:
                    error instanceof Error ? error.message : "Failed to refresh token",
            });
        }
    }


}

export default UserController