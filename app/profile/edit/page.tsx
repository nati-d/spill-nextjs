'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const EditProfilePage = () => {
    const { user, loading, error } = useUser();
    const router = useRouter();
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="p-6">
                <div className="text-red-500">Error: {error}</div>
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
        <div className="p-4">
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
            
            {/* Edit Form Content */}
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        Edit profile functionality coming soon...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        This page will allow you to update your profile information, photos, bio, interests, and social links.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;

