import { useState, useEffect } from "react";
import { loginUser } from "@/api/auth";
import { getTelegramPhotoUrl } from "@/utils/telegram";
import { User } from "@/types/user";



interface UseUserReturn {
  user: User | null;
  photoUrl: string | null;
  loading: boolean;
  error: string | null;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loginUser();
        setUser(data.user);
        setPhotoUrl(getTelegramPhotoUrl());
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  return { user, photoUrl, loading, error };
}

