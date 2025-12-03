import { UserUpdate } from "@/types/user";
import api from "./client";



export const loginUser = async() => {
    try {
        const response = await api.post("/auth/telegram");
        // Check if response.data exists and is valid
        if (!response.data) {
            throw new Error("No data in response");
        }
        return response.data;
    } catch (error: any) {
        // Log the full error for debugging
        if (error.response) {
            console.error("API Response Error:", {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error setting up request:", error.message);
        }
        throw error;
    }
}

export const updateUser = async (userData: UserUpdate) => {
    try {
        const response = await api.patch("auth/me", userData);
        if (!response.data) {
            throw new Error("No data in response");
        }
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error("Update User Error:", {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
            });
        }
        throw error;
    }
}