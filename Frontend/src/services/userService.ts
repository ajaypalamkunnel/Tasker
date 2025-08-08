import type { LoginFormData } from "../pages/Login"
import type { SignupFormData } from "../pages/SignupPage"
import type { ApiResponse } from "../types/apiResponse"
import type { IUser } from "../types/user"
import { apiRequest } from "../utils/apiClient"





export const login = async(formData:LoginFormData):Promise<ApiResponse<{ accessToken: string, user: Partial<IUser> }>>=>{
    return apiRequest<{ accessToken: string, user: Partial<IUser> }>(
        '/login',
        'POST',
        formData
    )
}


export const signup = async(formData:SignupFormData):Promise<ApiResponse<SignupFormData>> =>{

    return apiRequest<SignupFormData>(
        `/signup`,
        "POST",
        formData
    )

}



export const userLogout = async():Promise<ApiResponse<void>>=>{
    return apiRequest(
        `/logout`,
        "POST"
    )
}
