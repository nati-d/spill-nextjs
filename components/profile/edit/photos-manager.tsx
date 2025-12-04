"use client"

import React, { useRef } from "react"
import { X, Upload } from "lucide-react"
import { SectionHeader } from "./section-header"
import { isImageFile, validateFileSize, getFileSizeString } from "@/utils/file"
import type { PhotosManagerProps } from "@/types/profile"

export function PhotosManager({ photos, onAdd, onRemove }: PhotosManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const previewUrlsRef = React.useRef<Map<File, string>>(new Map())

  // Cleanup preview URLs when component unmounts or photos change
  React.useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url)
      })
      previewUrlsRef.current.clear()
    }
  }, [])

  // Cleanup preview URL when a photo is removed
  const handleRemove = (index: number) => {
    const fileToRemove = photos[index]
    const previewUrl = previewUrlsRef.current.get(fileToRemove)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      previewUrlsRef.current.delete(fileToRemove)
    }
    onRemove(index)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const fileArray = Array.from(files)
      const errors: string[] = []
      
      // Process each file
      for (const file of fileArray) {
        // Validate file type
        if (!isImageFile(file)) {
          errors.push(`${file.name} is not an image file`)
          continue
        }

        // Validate file size (max 5MB)
        if (!validateFileSize(file, 5)) {
          errors.push(`${file.name} is too large (${getFileSizeString(file.size)}). Maximum size is 5MB`)
          continue
        }

        // Add file directly (avoid duplicates by checking file name and size)
        const isDuplicate = photos.some(
          (existingFile) => existingFile.name === file.name && existingFile.size === file.size
        )
        
        if (!isDuplicate) {
          onAdd(file)
        }
      }

      // Show errors if any
      if (errors.length > 0) {
        setUploadError(errors.join(", "))
        setTimeout(() => setUploadError(null), 5000)
      }
    } catch (error) {
      console.error("Error processing images:", error)
      setUploadError("Failed to process images. Please try again.")
      setTimeout(() => setUploadError(null), 5000)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // Create preview URLs for images (with caching)
  const getPreviewUrl = (file: File): string => {
    if (!previewUrlsRef.current.has(file)) {
      const url = URL.createObjectURL(file)
      previewUrlsRef.current.set(file, url)
    }
    return previewUrlsRef.current.get(file)!
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Photos"
        count={photos.length}
        countLabel="photo"
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className="relative group aspect-square rounded-lg overflow-hidden bg-muted border border-border"
            >
              <img
                src={getPreviewUrl(file)}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="w-full h-32 border-2 border-dashed border-border rounded-lg bg-background hover:border-primary/50 hover:bg-muted/50 transition-all flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-sm text-muted-foreground">Processing images...</span>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Upload Photos</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to select images (max 5MB each)
                </p>
              </div>
            </>
          )}
        </button>
        {uploadError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3">
            <p className="text-sm text-red-700 dark:text-red-400">{uploadError}</p>
          </div>
        )}
      </div>
    </section>
  )
}
