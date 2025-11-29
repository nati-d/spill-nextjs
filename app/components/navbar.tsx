import { Bolt, Bell } from "lucide-react";
import NavbarLogo from "./navbar-logo";


export default function Navbar() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white">
            <Bolt className="w-6 h-6 cursor-pointer" />
            <NavbarLogo />
            <Bell className="w-6 h-6 cursor-pointer" />
        </div>
    )
}