"use client"

import React from "react"
import { Edit2, Trash2, Check, X, ChevronDown } from "lucide-react"
import { getSocialPlatformIcon } from "@/constants/social-platform-icons"
import type { SocialLinkItemProps } from "@/types/profile"
import type { SocialPlatform } from "@/constants/social-platforms"

export function SocialLinkItem({
  platform,
  link,
  isEditing,
  editingLink,
  isExpanded,
  onExpand,
  onCollapse,
  onStartEdit,
  onSave,
  onCancel,
  onRemove,
  onLinkChange,
}: SocialLinkItemProps) {
  if (isEditing) {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {getSocialPlatformIcon(platform as SocialPlatform)}
          </div>
          <div className="flex-1">
            <input
              type="url"
              value={editingLink}
              onChange={(e) => onLinkChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  onSave()
                } else if (e.key === "Escape") {
                  onCancel()
                }
              }}
              className="w-full h-10 px-3 rounded-lg border-2 border-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              placeholder="Enter URL"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSave}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white transition-all hover:bg-green-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              disabled={!editingLink.trim()}
              aria-label="Save changes"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all hover:bg-muted/80 hover:scale-105 active:scale-95"
              aria-label="Cancel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <button
        type="button"
        onClick={isExpanded ? onCollapse : onExpand}
        className="w-full text-left hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-transform ${isExpanded ? 'scale-110' : 'group-hover:scale-110'}`}>
            {getSocialPlatformIcon(platform as SocialPlatform)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold capitalize text-foreground">{platform}</span>
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
            >
              {link}
            </a>
          </div>

          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={onStartEdit}
            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95 font-medium"
            aria-label="Edit link"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-red-500/10 text-red-500 transition-all hover:bg-red-500/20 hover:scale-105 active:scale-95 font-medium"
            aria-label="Delete link"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}

