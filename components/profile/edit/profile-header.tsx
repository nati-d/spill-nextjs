"use client"

import { ArrowLeft } from "lucide-react"
import type { ProfileHeaderProps } from "@/types/profile"

export function ProfileHeader({ onBack }: ProfileHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-4 px-6 py-4 max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Edit Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Update your personal information</p>
        </div>
      </div>
    </div>
  )
}

