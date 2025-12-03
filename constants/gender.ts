export const GENDER_OPTIONS = ['male', 'female'] as const;

export type Gender = (typeof GENDER_OPTIONS)[number];

