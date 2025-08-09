import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "../store/userStore";
import type { RefreshResponse } from "./axiosTypes";



export const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URI || "http://localhost:8080";




export const isTokenExpired = (token: string): boolean => {
    try {
        const decodeToken: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodeToken.exp <= currentTime;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};



const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post<RefreshResponse>(
            `${API_BASE_URL}/refresh-token`,
            {},
            { 
                withCredentials: true,
                timeout: 10000 // 10 second timeout
            }
        );

        if (response.data.success) {
            const newAccessToken = response.data.accessToken;
            console.log("new access token==>", newAccessToken);

            useAuthStore.setState({ accessToken: newAccessToken });
            return newAccessToken;
        }

        return null;
    } catch (error) {
        console.error("error while refreshing access token", error);
        
        // If refresh fails, logout user
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        
        return null;
    }
};

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});



axiosInstance.interceptors.request.use(
    async (config) => {
        let token = useAuthStore.getState().accessToken;

        if (token) {
            if (isTokenExpired(token)) {
                const newToken = await refreshAccessToken();

                if (newToken) {
                    token = newToken
                } else {
                    useAuthStore.getState().logout()

                    if (typeof window !== 'undefined') {
                        window.location.href = '/login'
                    }
                    return Promise.reject(new Error("session Expired please login again"))
                }
            }
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);


export default axiosInstance
