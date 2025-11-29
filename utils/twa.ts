export const getInitData = async (): Promise<string> => {
    if (typeof window === "undefined") return "";
    
    const { default: WebApp } = await import("@twa-dev/sdk");
    return WebApp.initData || "";
}