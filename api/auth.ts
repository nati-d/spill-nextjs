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

export const updateUserWithPhotos = async (userData: UserUpdate, photos: File[]) => {
    try {
        const formData = new FormData();
        
        // Add all user data fields to FormData
        // Exclude photo_urls since we're sending actual files
        const { photo_urls, ...otherData } = userData;
        
        // Add each field to FormData
        Object.entries(otherData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    // For objects like social_links, stringify them
                    formData.append(key, JSON.stringify(value));
                } else if (Array.isArray(value)) {
                    // For arrays like interests, send as JSON string
                    formData.append(key, JSON.stringify(value));
                } else {
                    // For primitive values, convert to string
                    formData.append(key, String(value));
                }
            }
        });
        
        // Add photos as files - backend should handle these
        photos.forEach((photo) => {
            formData.append("photos", photo);
        });
        
        // Create a custom axios instance for multipart/form-data
        const { default: axios } = await import("axios");
        const { getInitData } = await import("@/utils/twa");
        
        const initData = await getInitData();
        const headers: Record<string, string> = {};
        if (initData) {
            headers["X-Telegram-InitData"] = initData;
        }
        // Don't set Content-Type header - let browser set it with boundary for FormData
        
        const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            formData,
            {
                headers,
                timeout: 60000, // Longer timeout for file uploads (60 seconds)
            }
        );
        
        if (!response.data) {
            throw new Error("No data in response");
        }
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error("Update User with Photos Error:", {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
            });
        }
        throw error;
    }
}