import api from "./client";

export const loginUser = async() => {
    const response = await api.post("/auth/telegram")
    return response.data;
}