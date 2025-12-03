export const SOCIAL_PLATFORMS = [
  'instagram',
  'twitter',
  'tiktok',
  'snapchat'
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

