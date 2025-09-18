import { FC } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils"; 

interface SidebarItemProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

const SidebarItem: FC<SidebarItemProps> = ({ title, href, icon }) => {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
    )}>
      {icon && <span>{icon}</span>}
      <span>{title}</span>
    </Link>
  );
};

export default SidebarItem;
