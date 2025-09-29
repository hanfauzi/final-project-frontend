import { FC } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils"; 

interface SidebarItemProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number;
}

const SidebarItem: FC<SidebarItemProps> = ({ title, href, icon, badge }) => {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
    )}>
       <div className="flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </div>
      {badge && badge > 0 && (
        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default SidebarItem;
