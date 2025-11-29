'use client';
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user?: {
    telegram_username?: string;
    telegram_id?: number;
  } | null;
  photoUrl?: string | null;
  size?: number;
  className?: string;
  showBorder?: boolean;
}

export function UserAvatar({ 
  user, 
  photoUrl, 
  size = 32, 
  className,
  showBorder = false 
}: UserAvatarProps) {
  const getInitials = () => {
    if (!user?.telegram_username) return "?";
    const username = user.telegram_username || "";
    return username.charAt(0).toUpperCase() || "?";
  };

  return (
    <div 
      className={cn(
        "rounded-full overflow-hidden flex-shrink-0",
        showBorder && "border-2 border-gray-200",
        className
      )}
      style={{ width: size, height: size }}
    >
      {photoUrl ? (
        <Image 
          src={photoUrl} 
          alt="User avatar" 
          width={size} 
          height={size}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
          {getInitials()}
        </div>
      )}
    </div>
  );
}

