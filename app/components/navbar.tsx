'use client';
import { Bell } from "lucide-react";
import NavbarLogo from "./navbar-logo";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useUser } from "@/hooks/useUser";

export default function Navbar() {
    const { user, photoUrl, loading } = useUser();

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white h-16">
            <div className="w-8 h-8 flex items-center justify-center">
                {loading ? (
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                ) : (
                    <div className="cursor-pointer">
                        <UserAvatar 
                            user={user} 
                            photoUrl={photoUrl}
                            size={32}
                            showBorder
                        />
                    </div>
                )}
            </div>
            <NavbarLogo />
            <div className="w-8 h-8 flex items-center justify-center">
                <Bell className="w-6 h-6 cursor-pointer" />
            </div>
        </div>
    )
}