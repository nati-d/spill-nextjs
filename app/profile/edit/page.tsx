'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { updateUser } from '@/api/auth';
import { userUpdateSchema, UserUpdateSchema } from '@/schemas/user';
import { ZodError } from 'zod';
import { SOCIAL_PLATFORMS, type SocialPlatform } from '@/constants/social-platforms';
import { GENDER_OPTIONS, type Gender } from '@/constants/gender';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const EditProfilePage = () => {
    const { user, loading: userLoading, error: userError } = useUser();
    const router = useRouter();
    
    // Form state
    const [age, setAge] = useState<number | null>(null);
    const [gender, setGender] = useState<Gender | ''>('');
    const [bio, setBio] = useState<string>('');
    const [interests, setInterests] = useState<string[]>([]);
    const [newInterest, setNewInterest] = useState<string>('');
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);
    const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
    const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
    const [newSocialPlatform, setNewSocialPlatform] = useState<string>('');
    const [newSocialLink, setNewSocialLink] = useState<string>('');
    
    // UI state
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    
    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setAge(user.age ?? null);
            setGender((user.gender && GENDER_OPTIONS.includes(user.gender as Gender)) ? (user.gender as Gender) : '');
            setBio(user.bio ?? '');
            setInterests(user.interests ?? []);
            setPhotoUrls(user.photo_urls ?? []);
            setSocialLinks(user.social_links ?? {});
        }
    }, [user]);
    
    // Add interest
    const handleAddInterest = () => {
        if (newInterest.trim() && !interests.includes(newInterest.trim())) {
            setInterests([...interests, newInterest.trim()]);
            setNewInterest('');
        }
    };
    
    // Remove interest
    const handleRemoveInterest = (index: number) => {
        setInterests(interests.filter((_, i) => i !== index));
    };
    
    // Add photo URL
    const handleAddPhotoUrl = () => {
        if (newPhotoUrl.trim() && !photoUrls.includes(newPhotoUrl.trim())) {
            setPhotoUrls([...photoUrls, newPhotoUrl.trim()]);
            setNewPhotoUrl('');
        }
    };
    
    // Remove photo URL
    const handleRemovePhotoUrl = (index: number) => {
        setPhotoUrls(photoUrls.filter((_, i) => i !== index));
    };
    
    // Add social link
    const handleAddSocialLink = () => {
        if (newSocialPlatform && newSocialLink.trim()) {
            // Ensure URL format - add https:// if not present
            let formattedLink = newSocialLink.trim();
            if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
                formattedLink = `https://${formattedLink}`;
            }
            
            setSocialLinks({
                ...socialLinks,
                [newSocialPlatform.toLowerCase()]: formattedLink
            });
            setNewSocialPlatform('');
            setNewSocialLink('');
        }
    };
    
    // Remove social link
    const handleRemoveSocialLink = (platform: string) => {
        const newLinks = { ...socialLinks };
        delete newLinks[platform];
        setSocialLinks(newLinks);
    };
    
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);
        setValidationErrors({});
        
        try {
            // Prepare update data - only include changed fields
            const updateData: Partial<UserUpdateSchema> = {};
            
            // Only include fields that have been changed
            if (age !== user?.age) updateData.age = age;
            if (gender !== (user?.gender ?? '')) updateData.gender = gender || null;
            if (bio !== (user?.bio ?? '')) updateData.bio = bio || null;
            
            // Check if interests changed
            const currentInterests = user?.interests ?? [];
            const interestsChanged = JSON.stringify([...interests].sort()) !== JSON.stringify([...currentInterests].sort());
            if (interestsChanged) updateData.interests = interests.length > 0 ? interests : null;
            
            // Check if photo URLs changed
            const currentPhotoUrls = user?.photo_urls ?? [];
            const photoUrlsChanged = JSON.stringify([...photoUrls].sort()) !== JSON.stringify([...currentPhotoUrls].sort());
            if (photoUrlsChanged) updateData.photo_urls = photoUrls.length > 0 ? photoUrls : null;
            
            // Check if social links changed
            const currentSocialLinks = user?.social_links ?? {};
            const socialLinksChanged = JSON.stringify(socialLinks) !== JSON.stringify(currentSocialLinks);
            if (socialLinksChanged) updateData.social_links = Object.keys(socialLinks).length > 0 ? socialLinks : null;
            
            // Validate with Zod
            const validationResult = userUpdateSchema.safeParse(updateData);
            
            if (!validationResult.success) {
                const errors: Record<string, string> = {};
                validationResult.error.issues.forEach((issue) => {
                    const path = issue.path.join('.');
                    errors[path] = issue.message;
                });
                setValidationErrors(errors);
                setSubmitting(false);
                return;
            }
            
            // Update user with validated data
            await updateUser(validationResult.data);
            setSubmitSuccess(true);
            
            // Redirect back to profile after a short delay
            setTimeout(() => {
                router.push('/profile');
                router.refresh(); // Refresh to get updated data
            }, 1500);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setSubmitError(error.response?.data?.detail || error.message || 'Failed to update profile');
        } finally {
            setSubmitting(false);
        }
    };
    
    if (userLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }
    
    if (userError) {
        return (
            <div className="p-6">
                <div className="text-red-500">Error: {userError}</div>
            </div>
        );
    }
    
    if (!user) {
        return (
            <div className="p-6">
                <div>No user data available</div>
            </div>
        );
    }
    
    return (
        <div className="p-4 pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold">Edit Profile</h1>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                {/* Success Message */}
                {submitSuccess && (
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 rounded-lg">
                        Profile updated successfully! Redirecting...
                    </div>
                )}
                
                {/* Error Message */}
                {submitError && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
                        {submitError}
                    </div>
                )}
                
                {/* Validation Errors */}
                {Object.keys(validationErrors).length > 0 && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
                        <p className="font-semibold mb-2">Validation Errors:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {Object.entries(validationErrors).map(([field, message]) => (
                                <li key={field}>
                                    <span className="font-medium">{field}:</span> {message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* Age */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label htmlFor="age" className="block text-sm font-medium mb-2">
                        Age
                    </label>
                    <input
                        id="age"
                        type="number"
                        min="1"
                        max="120"
                        value={age ?? ''}
                        onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : null)}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent ${
                            validationErrors.age ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        }`}
                        placeholder="Enter your age"
                    />
                    {validationErrors.age && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.age}</p>
                    )}
                </div>
                
                {/* Gender */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label htmlFor="gender" className="block text-sm font-medium mb-2">
                        Gender
                    </label>
                    <Select
                        value={gender || undefined}
                        onValueChange={(value) => setGender(value as Gender | '')}
                    >
                        <SelectTrigger className="w-full">
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
                
                {/* Bio */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label htmlFor="bio" className="block text-sm font-medium mb-2">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Tell us about yourself..."
                    />
                </div>
                
                {/* Interests */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2">
                        Interests
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {interests.map((interest, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                                {interest}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInterest(index)}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddInterest();
                                }
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Add an interest"
                        />
                        <button
                            type="button"
                            onClick={handleAddInterest}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                
                {/* Photo URLs */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2">
                        Photo URLs
                    </label>
                    <div className="space-y-2 mb-3">
                        {photoUrls.map((url, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700">
                                <span className="flex-1 text-sm truncate">{url}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhotoUrl(index)}
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                >
                                    <X className="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddPhotoUrl();
                                }
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Add a photo URL (must be a valid URL)"
                        />
                        <button
                            type="button"
                            onClick={handleAddPhotoUrl}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                
                {/* Social Links */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2">
                        Social Links
                    </label>
                    <div className="space-y-2 mb-3">
                        {Object.entries(socialLinks).map(([platform, link]) => (
                            <div key={platform} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700">
                                <span className="text-sm font-medium capitalize w-20">{platform}:</span>
                                <span className="flex-1 text-sm truncate">{link}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSocialLink(platform)}
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                >
                                    <X className="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <Select
                            value={newSocialPlatform || undefined}
                            onValueChange={(value) => setNewSocialPlatform(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Platform" />
                            </SelectTrigger>
                            <SelectContent>
                                {SOCIAL_PLATFORMS.filter(platform => !socialLinks[platform.toLowerCase()]).map((platform) => (
                                    <SelectItem key={platform} value={platform}>
                                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input
                            type="url"
                            value={newSocialLink}
                            onChange={(e) => setNewSocialLink(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSocialLink();
                                }
                            }}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="URL or Username"
                            disabled={!newSocialPlatform}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddSocialLink}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Add Social Link
                    </button>
                </div>
                
                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfilePage;
