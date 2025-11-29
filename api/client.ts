import axios from "axios";
import { getInitData } from "@/utils/twa";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})

// Request Interceptor - adds Telegram initData to all requests
api.interceptors.request.use(async (config) => {
    const initData = await getInitData();
    if (initData) {
        config.headers["X-Telegram-InitData"] = initData;
    }
    return config;
})

export default api;