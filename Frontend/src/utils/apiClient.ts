/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosRequestConfig, Method } from "axios";
import type { ApiResponse } from "../types/apiResponse";
import axiosInstance from "./axiosInstance";
import axios from "axios";

export async function apiRequest<T>(
    url: string,
    method: Method = "GET",
    data?: any,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
    try {
        console.log("hellooo");
        
        const response = await axiosInstance.request<ApiResponse<T>>({
            url,
            method,
            data,
            ...config,
        });

        console.log("Response : ",response);
        

        return {
            success: true,
            data: response.data as T
        };
    } catch (error: unknown) {
        let message = "An unexpected error occurred.";
        console.log("❌",error);
        
        if (axios.isAxiosError(error)) {
            const errorData = error.response?.data;
            
            // Handle different error response structures from backend
            if (typeof errorData === 'string') {
                // Backend sends plain string error
                message = errorData;
            } else if (errorData && typeof errorData === 'object') {
                // Backend sends object with error property
                if ('error' in errorData && typeof errorData.error === 'string') {
                    message = errorData.error;
                } else if ('errors' in errorData && Array.isArray(errorData.errors)) {
                    // Validation errors array
                    message = errorData.errors.join(', ');
                } else if ('message' in errorData && typeof errorData.message === 'string') {
                    message = errorData.message;
                } else {
                    // Fallback to stringified object
                    message = JSON.stringify(errorData);
                }
            } else {
                // Fallback to status text or default message
                message = error.response?.statusText || message;
            }
        }

        return {
            success: false,
            message,
        };
    }
}
