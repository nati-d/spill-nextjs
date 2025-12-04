"use client"

import { getSocialPlatformIcon } from "@/constants/social-platform-icons"
import type { SocialPlatform } from "@/constants/social-platforms"
import type { PlatformSelectorProps } from "@/types/profile"

export function PlatformSelector({ selectedPlatform, availablePlatforms, onSelect }: PlatformSelectorProps) {
  if (availablePlatforms.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">All platforms have been added</p>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
      {availablePlatforms.map((platform) => {
        const isSelected = selectedPlatform === platform
        return (
          <button
            key={platform}
            type="button"
            onClick={() => onSelect(platform)}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105 ${
              isSelected
                ? 'border-primary bg-primary/10'
                : 'border-border bg-background hover:border-primary/50'
            }`}
          >
            <div className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
              {getSocialPlatformIcon(platform as SocialPlatform)}
            </div>
            <span className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

