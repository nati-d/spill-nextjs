"use client"

import type React from "react"

import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, Save, Edit2, Check, Trash2, MoreVertical, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { updateUser } from "@/api/auth"
import { userUpdateSchema, type UserUpdateSchema } from "@/schemas/user"
import { SOCIAL_PLATFORMS, type SocialPlatform } from "@/constants/social-platforms"
import { GENDER_OPTIONS, type Gender } from "@/constants/gender"
import { getSocialPlatformIcon, getSocialPlatformColor } from "@/constants/social-platform-icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const EditProfilePage = () => {
  const { user, loading: userLoading, error: userError } = useUser()
  const router = useRouter()

  // Form state
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [age, setAge] = useState<number | null>(null)
  const [gender, setGender] = useState<Gender | "">("")
  const [bio, setBio] = useState<string>("")
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState<string>("")
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>("")
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({})
  const [newSocialPlatform, setNewSocialPlatform] = useState<string>("")
  const [newSocialLink, setNewSocialLink] = useState<string>("")
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<string>("")
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null)

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? "")
      setLastName(user.last_name ?? "")
      setAge(user.age ?? null)
      setGender(user.gender && GENDER_OPTIONS.includes(user.gender as Gender) ? (user.gender as Gender) : "")
      setBio(user.bio ?? "")
      setInterests(user.interests ?? [])
      setPhotoUrls(user.photo_urls ?? [])
      setSocialLinks(user.social_links ?? {})
    }
  }, [user])

  // Add interest
  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()])
      setNewInterest("")
    }
  }

  // Remove interest
  const handleRemoveInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index))
  }

  // Add photo URL
  const handleAddPhotoUrl = () => {
    if (newPhotoUrl.trim() && !photoUrls.includes(newPhotoUrl.trim())) {
      setPhotoUrls([...photoUrls, newPhotoUrl.trim()])
      setNewPhotoUrl("")
    }
  }

  // Remove photo URL
  const handleRemovePhotoUrl = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index))
  }

  // Add social link
  const handleAddSocialLink = () => {
    if (newSocialPlatform && newSocialLink.trim()) {
      let formattedLink = newSocialLink.trim()
      if (!formattedLink.startsWith("http://") && !formattedLink.startsWith("https://")) {
        formattedLink = `https://${formattedLink}`
      }

      setSocialLinks({
        ...socialLinks,
        [newSocialPlatform.toLowerCase()]: formattedLink,
      })
      setNewSocialPlatform("")
      setNewSocialLink("")
    }
  }

  // Remove social link
  const handleRemoveSocialLink = (platform: string) => {
    const newLinks = { ...socialLinks }
    delete newLinks[platform]
    setSocialLinks(newLinks)
  }
  
  // Start editing social link
  const handleStartEditSocialLink = (platform: string, currentLink: string) => {
    setEditingPlatform(platform)
    setEditingLink(currentLink)
  }
  
  // Save edited social link
  const handleSaveSocialLink = (platform: string) => {
    if (editingLink.trim()) {
      let formattedLink = editingLink.trim()
      if (!formattedLink.startsWith("http://") && !formattedLink.startsWith("https://")) {
        formattedLink = `https://${formattedLink}`
      }
      
      setSocialLinks({
        ...socialLinks,
        [platform]: formattedLink,
      })
      setEditingPlatform(null)
      setEditingLink("")
      setExpandedPlatform(null)
    }
  }
  
  // Cancel editing social link
  const handleCancelEditSocialLink = () => {
    setEditingPlatform(null)
    setEditingLink("")
    setExpandedPlatform(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    setValidationErrors({})

    try {
      const updateData: Partial<UserUpdateSchema> = {}

      if (firstName !== (user?.first_name ?? "")) updateData.first_name = firstName
      if (lastName !== (user?.last_name ?? "")) updateData.last_name = lastName || null
      if (age !== user?.age) updateData.age = age
      if (gender !== (user?.gender ?? "")) updateData.gender = gender || null
      if (bio !== (user?.bio ?? "")) updateData.bio = bio || null

      const currentInterests = user?.interests ?? []
      const interestsChanged = JSON.stringify([...interests].sort()) !== JSON.stringify([...currentInterests].sort())
      if (interestsChanged) updateData.interests = interests.length > 0 ? interests : null

      const currentPhotoUrls = user?.photo_urls ?? []
      const photoUrlsChanged = JSON.stringify([...photoUrls].sort()) !== JSON.stringify([...currentPhotoUrls].sort())
      if (photoUrlsChanged) updateData.photo_urls = photoUrls.length > 0 ? photoUrls : null

      const currentSocialLinks = user?.social_links ?? {}
      const socialLinksChanged = JSON.stringify(socialLinks) !== JSON.stringify(currentSocialLinks)
      if (socialLinksChanged) updateData.social_links = Object.keys(socialLinks).length > 0 ? socialLinks : null

      const validationResult = userUpdateSchema.safeParse(updateData)

      if (!validationResult.success) {
        const errors: Record<string, string> = {}
        validationResult.error.issues.forEach((issue) => {
          const path = issue.path.join(".")
          errors[path] = issue.message
        })
        setValidationErrors(errors)
        setSubmitting(false)
        return
      }

      await updateUser(validationResult.data)
      setSubmitSuccess(true)

      setTimeout(() => {
        router.push("/profile")
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setSubmitError(error.response?.data?.detail || error.message || "Failed to update profile")
    } finally {
      setSubmitting(false)
    }
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (userError) {
    return (
      <div className="p-6">
        <div className="text-red-500">Error: {userError}</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6">
        <div>No user data available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-6 py-4 max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
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

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {submitSuccess && (
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-4">
            <p className="text-green-700 dark:text-green-400 text-sm font-medium">
              ✓ Profile updated successfully! Redirecting...
            </p>
          </div>
        )}

        {submitError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4">
            <p className="text-red-700 dark:text-red-400 text-sm font-medium">✕ {submitError}</p>
          </div>
        )}

        {Object.keys(validationErrors).length > 0 && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4">
            <p className="text-red-700 dark:text-red-400 text-sm font-semibold mb-3">Validation Errors</p>
            <ul className="space-y-2">
              {Object.entries(validationErrors).map(([field, message]) => (
                <li key={field} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                  <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
                  <span>
                    <span className="font-medium capitalize">{field.replace(/_/g, " ")}</span>: {message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <section className="space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
            <p className="text-sm text-muted-foreground mt-1">Your personal details</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="First Name"
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              error={validationErrors.first_name}
            />
            <FormField
              label="Last Name"
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              error={validationErrors.last_name}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Age"
              id="age"
              type="number"
              min="1"
              max="120"
              value={age ?? ""}
              onChange={(e) => setAge(e.target.value ? Number.parseInt(e.target.value) : null)}
              placeholder="25"
              error={validationErrors.age}
            />
            <div className="space-y-2 w-full">
              <label htmlFor="gender" className="text-sm font-medium text-foreground">
                Gender
              </label>
              <Select value={gender || undefined} onValueChange={(value) => setGender(value as Gender | "")}>
                <SelectTrigger className="w-full h-10 rounded-lg border-border hover:border-primary/50 bg-background">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-semibold text-foreground">About You</h2>
            <p className="text-sm text-muted-foreground mt-1">Tell others about yourself</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium text-foreground">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="Tell us about yourself..."
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-semibold text-foreground">Interests</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {interests.length} interest{interests.length !== 1 ? "s" : ""} added
            </p>
          </div>

          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary rounded-full text-sm font-medium"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(index)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddInterest()
                }
              }}
              className="flex-1 h-10 px-4 rounded-lg border border-border bg-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="Add an interest (press Enter)"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="h-10 px-4 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center font-medium"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-semibold text-foreground">Photos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {photoUrls.length} photo{photoUrls.length !== 1 ? "s" : ""} added
            </p>
          </div>

          {photoUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photoUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-muted border border-border"
                >
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <button
                      type="button"
                      onClick={() => handleRemovePhotoUrl(index)}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <input
              type="url"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddPhotoUrl()
                }
              }}
              className="flex-1 h-10 px-4 rounded-lg border border-border bg-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="Paste photo URL (press Enter)"
            />
            <button
              type="button"
              onClick={handleAddPhotoUrl}
              className="h-10 px-4 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center font-medium"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-semibold text-foreground">Social Links</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {Object.keys(socialLinks).length} link{Object.keys(socialLinks).length !== 1 ? "s" : ""} added
            </p>
          </div>

          {Object.keys(socialLinks).length > 0 && (
            <div className="space-y-3">
              {Object.entries(socialLinks).map(([platform, link]) => (
                <div
                  key={platform}
                  className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  {editingPlatform === platform ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {getSocialPlatformIcon(platform as SocialPlatform)}
                      </div>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={editingLink}
                          onChange={(e) => setEditingLink(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleSaveSocialLink(platform)
                            } else if (e.key === "Escape") {
                              handleCancelEditSocialLink()
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
                          onClick={() => handleSaveSocialLink(platform)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white transition-all hover:bg-green-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                          disabled={!editingLink.trim()}
                          aria-label="Save changes"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditSocialLink}
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all hover:bg-muted/80 hover:scale-105 active:scale-95"
                          aria-label="Cancel"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedPlatform(expandedPlatform === platform ? null : platform)}
                        className="w-full text-left hover:opacity-90 transition-opacity"
                      >
                        <div className="flex items-center gap-4">
                          {/* Platform Icon */}
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-transform ${expandedPlatform === platform ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {getSocialPlatformIcon(platform as SocialPlatform)}
                          </div>
                          
                          {/* Platform Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold capitalize text-foreground">{platform}</span>
                            </div>
                            <a
                              href={link as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                            >
                              {link as string}
                            </a>
                          </div>

                          {/* Expand/Collapse Indicator */}
                          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${expandedPlatform === platform ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {/* Action Buttons - Appear below when clicked */}
                      {expandedPlatform === platform && (
                        <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button
                            type="button"
                            onClick={() => {
                              handleStartEditSocialLink(platform, link)
                              setExpandedPlatform(null)
                            }}
                            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95 font-medium"
                            aria-label="Edit link"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleRemoveSocialLink(platform)
                              setExpandedPlatform(null)
                            }}
                            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-red-500/10 text-red-500 transition-all hover:bg-red-500/20 hover:scale-105 active:scale-95 font-medium"
                            aria-label="Delete link"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 pt-2">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select Platform
              </label>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_PLATFORMS.filter((platform) => !socialLinks[platform.toLowerCase()]).map((platform) => {
                  const isSelected = newSocialPlatform === platform;
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => setNewSocialPlatform(platform)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50'
                      }`}
                    >
                      <div className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
                        {getSocialPlatformIcon(platform)}
                      </div>
                      <span className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    </button>
                  );
                })}
                {SOCIAL_PLATFORMS.filter((platform) => !socialLinks[platform.toLowerCase()]).length === 0 && (
                  <p className="text-sm text-muted-foreground">All platforms have been added</p>
                )}
              </div>
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

        <div className="pt-6 pb-4 bg-gradient-to-t from-background via-background to-transparent -mx-6 px-6">
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

interface FormFieldProps {
  label: string
  id: string
  type?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  min?: string | number
  max?: string | number
}

function FormField({ label, id, type = "text", value, onChange, placeholder, error, min, max }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className={`w-full h-10 px-4 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
          error ? "border-red-500 bg-red-50 dark:bg-red-950/20" : "border-border bg-background hover:border-primary/50"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default EditProfilePage
