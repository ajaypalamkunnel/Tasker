import type { LoginFormData } from "../pages/Login"
import type { SignupFormData } from "../pages/SignupPage"
import type { ApiResponse } from "../types/apiResponse"
import type { IUser } from "../types/user"
import type { ITask, ICreateTaskData, IUpdateTaskData, IPaginatedTasksResponse, ITaskFilter, IPaginationParams } from "../types/task"
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

// Task related API functions
export const createTask = async(taskData: ICreateTaskData): Promise<ApiResponse<ITask>> => {
    console.log("==>",taskData);
    
    return apiRequest<ITask>(
        '/tasks',
        'POST',
        { data: taskData }
    )
}

export const updateTask = async(taskId: string, taskData: IUpdateTaskData): Promise<ApiResponse<ITask>> => {
    return apiRequest<ITask>(
        `/tasks/${taskId}`,
        'PUT',
        taskData
    )
}

export const updateTaskStatus = async(taskId: string, status: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(
        `/tasks/${taskId}/status`,
        'PATCH',
        { status }
    )
}

export const deleteTask = async(taskId: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(
        `/tasks/${taskId}`,
        'DELETE'
    )
}

export const fetchTasks = async(filter?: ITaskFilter, pagination?: IPaginationParams): Promise<ApiResponse<IPaginatedTasksResponse>> => {
    const params = new URLSearchParams();
    
    if (filter?.status) {
        params.append('status', filter.status);
    }
    
    if (pagination) {
        params.append('page', pagination.page.toString());
        params.append('limit', pagination.limit.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';
    
    return apiRequest<IPaginatedTasksResponse>(
        url,
        'GET'
    )
}
