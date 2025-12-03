import { z } from 'zod';
import { GENDER_OPTIONS } from '@/constants/gender';

export const userUpdateSchema = z.object({
  age: z.number().int().min(1).max(120).nullable().optional(),
  gender: z.enum(GENDER_OPTIONS).nullable().optional(),
  bio: z.string().nullable().optional(),
  interests: z.array(z.string()).nullable().optional(),
  photo_urls: z.array(z.string().url()).nullable().optional(),
  social_links: z.record(z.string(), z.string()).nullable().optional(),
}).partial();

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;

