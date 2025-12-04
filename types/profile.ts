export interface FormFieldProps {
  label: string
  id: string
  type?: string
  value: string | number | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  min?: string | number
  max?: string | number
}

export interface SectionHeaderProps {
  title: string
  description?: string
  count?: number
  countLabel?: string
}

export interface AlertMessagesProps {
  success?: boolean
  error?: string | null
  validationErrors?: Record<string, string>
}

export interface ProfileHeaderProps {
  onBack: () => void
}

export interface InterestsManagerProps {
  interests: string[]
  onAdd: (interest: string) => void
  onRemove: (index: number) => void
}

export interface PhotosManagerProps {
  photos: File[]
  onAdd: (file: File) => void
  onRemove: (index: number) => void
}

export interface SocialLinkItemProps {
  platform: string
  link: string
  isEditing: boolean
  editingLink: string
  isExpanded: boolean
  onExpand: () => void
  onCollapse: () => void
  onStartEdit: () => void
  onSave: () => void
  onCancel: () => void
  onRemove: () => void
  onLinkChange: (value: string) => void
}

export interface PlatformSelectorProps {
  selectedPlatform: string
  availablePlatforms: string[]
  onSelect: (platform: string) => void
}

export interface SocialLinksManagerProps {
  socialLinks: Record<string, string>
  onUpdate: (links: Record<string, string>) => void
}

