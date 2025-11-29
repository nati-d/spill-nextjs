'use client';
import { cn } from "@/lib/utils";

export const FloatingDock = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
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
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full flex h-16 items-center justify-between gap-4 px-4 rounded-2xl bg-gray-50  dark:bg-neutral-900",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer key={item.title} {...item} />
      ))}
    </div>
  );
};

function IconContainer({
  title,
  icon,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <a href={href} className="transition-transform duration-200 hover:scale-110">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800">
        <div className="flex h-6 w-6 items-center justify-center">
          {icon}
        </div>
      </div>
    </a>
  );
}
