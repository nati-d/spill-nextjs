"use client"

import type React from "react"

import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { useState, useEffect } from "react"
import { updateUser, updateUserWithPhotos } from "@/api/auth"
import { userUpdateSchema, type UserUpdateSchema } from "@/schemas/user"
import { GENDER_OPTIONS, type Gender } from "@/constants/gender"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import extracted components
import { ProfileHeader } from "@/components/profile/edit/profile-header"
import { SectionHeader } from "@/components/profile/edit/section-header"
import { AlertMessages } from "@/components/profile/edit/alert-messages"
import { FormField } from "@/components/profile/edit/form-field"
import { InterestsManager } from "@/components/profile/edit/interests-manager"
import { PhotosManager } from "@/components/profile/edit/photos-manager"
import { SocialLinksManager } from "@/components/profile/edit/social-links-manager"

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
  const [photos, setPhotos] = useState<File[]>([])
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>([])
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({})

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
      setExistingPhotoUrls(user.photo_urls ?? [])
      setPhotos([]) // New photos will be added here
      setSocialLinks(user.social_links ?? {})
    }
  }, [user])

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

      // Handle photo uploads - only send if there are new photos
      // Note: We'll send photos separately as FormData

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

      // If there are new photos, send them as FormData
      if (photos.length > 0) {
        await updateUserWithPhotos(validationResult.data, photos)
      } else {
        await updateUser(validationResult.data)
      }
      setSubmitSuccess(true)

      setTimeout(() => {
        router.push("/profile")
        router.refresh()
      }, 1500)
    } catch (error: unknown) {
      console.error("Error updating profile:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to update profile")
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
      <ProfileHeader onBack={() => router.back()} />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <AlertMessages
          success={submitSuccess}
          error={submitError}
          validationErrors={validationErrors}
        />

        {/* Basic Information Section */}
        <section className="space-y-4">
          <SectionHeader
            title="Basic Information"
            description="Your personal details"
          />

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

        {/* About You Section */}
        <section className="space-y-4">
          <SectionHeader
            title="About You"
            description="Tell others about yourself"
          />

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

        {/* Interests Section */}
        <InterestsManager
          interests={interests}
          onAdd={(interest) => setInterests([...interests, interest])}
          onRemove={(index) => setInterests(interests.filter((_, i) => i !== index))}
        />

        {/* Photos Section */}
        <PhotosManager
          photos={photos}
          onAdd={(file) => setPhotos([...photos, file])}
          onRemove={(index) => setPhotos(photos.filter((_, i) => i !== index))}
        />

        {/* Social Links Section */}
        <SocialLinksManager
          socialLinks={socialLinks}
          onUpdate={setSocialLinks}
        />

        {/* Submit Button */}
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

export default EditProfilePage

