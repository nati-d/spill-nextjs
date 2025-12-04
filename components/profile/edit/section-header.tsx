"use client"

import type { SectionHeaderProps } from "@/types/profile"

export function SectionHeader({ title, description, count, countLabel }: SectionHeaderProps) {
  return (
    <div className="border-b border-border pb-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      {!description && count !== undefined && countLabel && (
        <p className="text-sm text-muted-foreground mt-1">
          {count} {countLabel}{count !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}

