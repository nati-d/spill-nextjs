"use client"

import React from "react"
import { Plus } from "lucide-react"
import { SectionHeader } from "./section-header"
import { SocialLinkItem } from "./social-link-item"
import { PlatformSelector } from "./platform-selector"
import { SOCIAL_PLATFORMS } from "@/constants/social-platforms"
import type { SocialLinksManagerProps } from "@/types/profile"

export function SocialLinksManager({ socialLinks, onUpdate }: SocialLinksManagerProps) {
  const [newSocialPlatform, setNewSocialPlatform] = React.useState<string>("")
  const [newSocialLink, setNewSocialLink] = React.useState<string>("")
  const [editingPlatform, setEditingPlatform] = React.useState<string | null>(null)
  const [editingLink, setEditingLink] = React.useState<string>("")
  const [expandedPlatform, setExpandedPlatform] = React.useState<string | null>(null)

  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    (platform) => !socialLinks[platform.toLowerCase()]
  )

  const handleAddSocialLink = () => {
    if (newSocialPlatform && newSocialLink.trim()) {
      let formattedLink = newSocialLink.trim()
      if (!formattedLink.startsWith("http://") && !formattedLink.startsWith("https://")) {
        formattedLink = `https://${formattedLink}`
      }

      const updatedLinks = {
        ...socialLinks,
        [newSocialPlatform.toLowerCase()]: formattedLink,
      }
      onUpdate(updatedLinks)
      setNewSocialPlatform("")
      setNewSocialLink("")
    }
  }

  const handleRemoveSocialLink = (platform: string) => {
    const updatedLinks = { ...socialLinks }
    delete updatedLinks[platform]
    onUpdate(updatedLinks)
    setExpandedPlatform(null)
  }

  const handleStartEditSocialLink = (platform: string, currentLink: string) => {
    setEditingPlatform(platform)
    setEditingLink(currentLink)
    setExpandedPlatform(null)
  }

  const handleSaveSocialLink = (platform: string) => {
    if (editingLink.trim()) {
      let formattedLink = editingLink.trim()
      if (!formattedLink.startsWith("http://") && !formattedLink.startsWith("https://")) {
        formattedLink = `https://${formattedLink}`
      }

      const updatedLinks = {
        ...socialLinks,
        [platform]: formattedLink,
      }
      onUpdate(updatedLinks)
      setEditingPlatform(null)
      setEditingLink("")
      setExpandedPlatform(null)
    }
  }

  const handleCancelEditSocialLink = () => {
    setEditingPlatform(null)
    setEditingLink("")
    setExpandedPlatform(null)
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Social Links"
        count={Object.keys(socialLinks).length}
        countLabel="link"
      />

      {Object.keys(socialLinks).length > 0 && (
        <div className="space-y-3">
          {Object.entries(socialLinks).map(([platform, link]) => (
            <SocialLinkItem
              key={platform}
              platform={platform}
              link={link}
              isEditing={editingPlatform === platform}
              editingLink={editingLink}
              isExpanded={expandedPlatform === platform}
              onExpand={() => setExpandedPlatform(platform)}
              onCollapse={() => setExpandedPlatform(null)}
              onStartEdit={() => handleStartEditSocialLink(platform, link)}
              onSave={() => handleSaveSocialLink(platform)}
              onCancel={handleCancelEditSocialLink}
              onRemove={() => handleRemoveSocialLink(platform)}
              onLinkChange={setEditingLink}
            />
          ))}
        </div>
      )}

      <div className="space-y-4 pt-2">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Select Platform</label>
          <PlatformSelector
            selectedPlatform={newSocialPlatform}
            availablePlatforms={availablePlatforms}
            onSelect={setNewSocialPlatform}
          />
        </div>

        {newSocialPlatform && (
          <div className="flex gap-2">
            <input
              type="url"
              value={newSocialLink}
              onChange={(e) => setNewSocialLink(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddSocialLink()
                }
              }}
              className="flex-1 h-10 px-4 rounded-lg border border-border bg-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="URL or username"
            />
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="h-10 px-4 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newSocialLink.trim()}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

