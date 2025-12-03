export interface User {
    id: number;
    username: string | null;
    first_name: string;
    last_name: string | null;
    profile_photo_url: string | null;
    language_code: string | null;
    nickname: string;
    age: number | null;
    gender: string | null;
    bio: string | null;
    interests: string[] | null;
    photo_urls: string[] | null;
    social_links: Record<string, any> | null;
    allow_discovery: boolean;
    is_banned: boolean;
    banned_at: string | null;
    banned_reason: string | null;
    stars_balance: number;
    is_premium: boolean;
    created_at: string;
    updated_at: string;
  }

  export type { UserUpdateSchema as UserUpdate } from '@/schemas/user';