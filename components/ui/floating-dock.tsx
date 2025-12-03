'use client';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const FloatingDock = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; iconFilled?: React.ReactNode; href: string }[];
  className?: string;
}) => {
  return (
    <FloatingDockDesktop items={items} className={className} />
  );
};


const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; iconFilled?: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "w-full flex items-center justify-between gap-4 px-4 py-3 rounded-4xl  dark:bg-neutral-900",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer 
          key={item.title} 
          {...item} 
          isActive={pathname === item.href || (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname?.startsWith(item.href))}
        />
      ))}
    </div>
  );
};

function IconContainer({
  title,
  icon,
  iconFilled,
  href,
  isActive,
}: {
  title: string;
  icon: React.ReactNode;
  iconFilled?: React.ReactNode;
  href: string;
  isActive?: boolean;
}) {
  const displayIcon = isActive && iconFilled ? iconFilled : icon;

  return (
    <a href={href} className="flex flex-col items-center gap-1 transition-transform duration-200 hover:scale-105">
      <div className={cn(
        "relative flex text-black dark:text-white items-center justify-center transition-colors",
        !isActive && "rounded-full dark:bg-neutral-800"
      )}>
        <div className="flex text-black dark:text-white h-7 w-7 items-center justify-center">
          {displayIcon}
        </div>
      </div>
      <span className={cn(
        "text-xs font-medium transition-colors",
        isActive ? "text-primary" : "text-black dark:text-white"
      )}>
        {title}
      </span>
    </a>
  );
}
