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
        "w-full flex h-16 items-center justify-between gap-4 px-4 rounded-2xl bg-gray-50  dark:bg-neutral-900",
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
    <a href={href} className="transition-transform duration-200 hover:scale-110">
      <div className={cn(
        "relative flex h-12 w-12 items-center justify-center rounded-full  dark:bg-neutral-800 transition-colors",
        isActive && "border-2 border-primary"
      )}>
        <div className="flex h-6 w-6 items-center justify-center">
          {displayIcon}
        </div>
      </div>
    </a>
  );
}
