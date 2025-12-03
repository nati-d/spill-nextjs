'use client';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';

const ProfilePage = () => {
    const { user, photoUrl, loading, error } = useUser();
    
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
                <div className="mt-4 flex flex-col items-center space-y-1">
                    <h1 className="text-2xl font-bold">{user.nickname || user.username || user.first_name}</h1>
                    <p className="text-sm text-gray-500">{user.first_name} {user.last_name}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;