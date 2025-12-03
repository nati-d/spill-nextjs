'use client';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import { Link as LinkIcon, Instagram, Twitter, Facebook, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const ProfilePage = () => {
    const { user, photoUrl, loading, error } = useUser();
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
    
    // Dummy values for fields if backend doesn't return data
    const displayAge = user?.age ?? 25;
    const displayGender = user?.gender ?? 'male';
    const displayBio = user?.bio ?? `Hi! I'm ${user?.nickname || user?.username || user?.first_name || 'a user'} and I love exploring new experiences. Passionate about connecting with others and sharing life's moments. Always up for an adventure!`;
    const displayInterests = user?.interests && user.interests.length > 0 
        ? user.interests 
        : ['Music', 'Travel', 'Photography', 'Food'];
    // Use cover.png as fallback for photos if photo_urls is empty (duplicate 4 times)
    const displayPhotoUrls = user?.photo_urls && user.photo_urls.length > 0
        ? user.photo_urls
        : ['/images/cover.png', '/images/cover.png', '/images/cover.png', '/images/cover.png'];
    const displaySocialLinks = user?.social_links && Object.keys(user.social_links).length > 0
        ? user.social_links
        : { instagram: 'https://instagram.com', twitter: 'https://twitter.com' };
    
    // Handle keyboard navigation in photo modal
    useEffect(() => {
        if (selectedPhotoIndex === null) return;
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedPhotoIndex(null);
            } else if (e.key === 'ArrowLeft' && selectedPhotoIndex > 0) {
                setSelectedPhotoIndex(selectedPhotoIndex - 1);
            } else if (e.key === 'ArrowRight' && selectedPhotoIndex < displayPhotoUrls.length - 1) {
                setSelectedPhotoIndex(selectedPhotoIndex + 1);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhotoIndex, displayPhotoUrls.length]);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user data</div>;
    
    return (
        <div className="relative p-4">
            {/* Cover Image Section */}
            <div className="relative h-32 w-full overflow-hidden rounded-3xl">
                <Image
                    src="/images/cover.png"
                    alt="Cover"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            
            {/* Avatar positioned to overlap half of the cover */}
            <div className="flex flex-col items-center -mt-[70px]">
                <div className="relative z-10">
                    <UserAvatar 
                        user={user}
                        photoUrl={photoUrl || user.profile_photo_url}
                        size={120}
                        showBorder={true}
                        className="border-4 border-primary shadow-lg"
                    />
                </div>
                
                {/* User Info */}
                <div className="mt-4 flex flex-col items-center space-y-1 w-full">
                    <h1 className="text-2xl font-bold">{user.nickname || user.username || user.first_name}</h1>
                    <p className="text-sm text-gray-500">{user.first_name} {user.last_name}</p>
                    
                    {/* Age and Gender */}
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{displayAge} years old</span>
                        <span>•</span>
                        <span className="capitalize">{displayGender}</span>
                    </div>
                </div>
                
                {/* Bio Section */}
                <div className="mt-6 w-full">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-2">About</h2>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {displayBio}
                        </p>
                    </div>
                </div>
                
                {/* Interests Section */}
                <div className="mt-4 w-full">
                    <h2 className="text-lg font-semibold mb-3">Interests</h2>
                    <div className="flex flex-wrap gap-2">
                        {displayInterests.map((interest, index) => (
                            <span 
                                key={index}
                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                            >
                                {interest}
                        </span>
                        ))}
                    </div>
                </div>
                
                {/* Photos Section */}
                <div className="mt-6 w-full">
                    <h2 className="text-lg font-semibold mb-3">Photos</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {displayPhotoUrls.map((url, index) => (
                            <div 
                                key={index} 
                                className="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedPhotoIndex(index)}
                            >
                                <Image
                                    src={url}
                                    alt={`Photo ${index + 1}`}
                                    width={150}
                                    height={150}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Photo Modal */}
                {selectedPhotoIndex !== null && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                        onClick={() => setSelectedPhotoIndex(null)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedPhotoIndex(null)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                        
                        {/* Previous Button */}
                        {selectedPhotoIndex > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPhotoIndex(selectedPhotoIndex - 1);
                                }}
                                className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Previous photo"
                            >
                                <ChevronLeft className="h-6 w-6 text-white" />
                            </button>
                        )}
                        
                        {/* Next Button */}
                        {selectedPhotoIndex < displayPhotoUrls.length - 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPhotoIndex(selectedPhotoIndex + 1);
                                }}
                                className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Next photo"
                            >
                                <ChevronRight className="h-6 w-6 text-white" />
                            </button>
                        )}
                        
                        {/* Image */}
                        <div 
                            className="relative max-w-[90vw] max-h-[90vh] mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={displayPhotoUrls[selectedPhotoIndex]}
                                alt={`Photo ${selectedPhotoIndex + 1}`}
                                width={1200}
                                height={1200}
                                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                                priority
                            />
                            
                            {/* Photo Counter */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                                <span className="text-white text-sm">
                                    {selectedPhotoIndex + 1} / {displayPhotoUrls.length}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Social Links Section */}
                <div className="mt-6 w-full">
                    <h2 className="text-lg font-semibold mb-3">Social Links</h2>
                    <div className="space-y-2">
                        {Object.entries(displaySocialLinks).map(([platform, link]) => {
                            const getIcon = () => {
                                const platformLower = platform.toLowerCase();
                                if (platformLower.includes('instagram')) return <Instagram className="h-5 w-5" />;
                                if (platformLower.includes('twitter')) return <Twitter className="h-5 w-5" />;
                                if (platformLower.includes('facebook')) return <Facebook className="h-5 w-5" />;
                                return <LinkIcon className="h-5 w-5" />;
                            };
                            
                            return (
                                <a
                                    key={platform}
                                    href={link as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {getIcon()}
                                    <span className="capitalize font-medium">{platform}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;