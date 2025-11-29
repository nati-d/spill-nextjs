import Image from 'next/image'

export default function NavbarLogo() {
    return (
        <div className="h-10 w-auto flex items-center justify-center">
            <Image 
                src="/images/spill-logo.png" 
                alt="Spill" 
                width={60} 
                height={60} 
                priority
                className="h-full w-auto object-contain"
            />
        </div>
    )
}