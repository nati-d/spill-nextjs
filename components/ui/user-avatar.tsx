'use client';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";

interface UserAvatarProps {
    user?: User;
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
    if (!user?.username) return "?";
    const username = user.username || "";
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

