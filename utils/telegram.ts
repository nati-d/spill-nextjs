export const getTelegramPhotoUrl = (): string | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const WebApp = (window as any).Telegram?.WebApp;
    if (WebApp?.initDataUnsafe?.user?.photo_url) {
      return WebApp.initDataUnsafe.user.photo_url;
    }
  } catch (err) {
    console.error("Error getting Telegram photo:", err);
  }
  
  return null;
};

export const getTelegramUser = () => {
  if (typeof window === "undefined") return null;
  
  try {
    const WebApp = (window as any).Telegram?.WebApp;
    return WebApp?.initDataUnsafe?.user || null;
  } catch (err) {
    console.error("Error getting Telegram user:", err);
    return null;
  }
};

