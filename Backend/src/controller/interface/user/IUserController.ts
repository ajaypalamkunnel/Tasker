import { Request,Response } from "express"


export interface IUserController{


    registerUser(req: Request, res: Response):Promise<Response>
    resendOtp(req: Request, res: Response): Promise<Response>
    verifyOtp(req: Request, res: Response): Promise<Response>
    postLogin(req: Request, res: Response): Promise<Response>
    logout(req: Request, res: Response): Promise<Response>
    renewAuthTokens(req: Request, res: Response): Promise<void>;
    
    
}