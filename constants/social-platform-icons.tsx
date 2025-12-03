import React from 'react';
import { Instagram, Twitter, Video, Camera } from 'lucide-react';
import { SocialPlatform } from './social-platforms';

export const getSocialPlatformIcon = (platform: SocialPlatform): React.ReactNode => {
  const iconProps = { className: "h-5 w-5", strokeWidth: 2 };
  
  switch (platform.toLowerCase()) {
    case 'instagram':
      return React.createElement(Instagram, iconProps);
    case 'twitter':
      return React.createElement(Twitter, iconProps);
    case 'tiktok':
      return React.createElement(Video, iconProps);
    case 'snapchat':
      return React.createElement(Camera, iconProps);
    default:
      return React.createElement(Camera, iconProps);
  }
};

export const getSocialPlatformColor = (platform: SocialPlatform): string => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return 'from-purple-500 to-pink-500';
    case 'twitter':
      return 'from-blue-400 to-blue-600';
    case 'tiktok':
      return 'from-black to-gray-800';
    case 'snapchat':
      return 'from-yellow-400 to-yellow-500';
    default:
      return 'from-gray-400 to-gray-600';
  }
};

