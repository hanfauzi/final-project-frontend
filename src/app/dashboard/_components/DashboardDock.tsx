"use client";

import { CalendarClock, Home, NotebookPen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardDock() {
  const pathName = usePathname();

  const paths = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/attendance", label: "Attendance", icon: CalendarClock },
    { href: "#task", label: "Task", icon: NotebookPen },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-50/90 backdrop-blur border-t border-gray-200 shadow-[0_-3px_12px_-4px_rgba(0,0,0,0.1)]">
      <div className="relative mx-auto max-w-sm flex justify-between px-4">
        {paths.map(({ href, label, icon: Icon }) => {
          let isActive = false;

          if (href.startsWith("#")) {
            isActive = false;
          } else if (href === "/dashboard") {
            isActive = pathName === "/dashboard";
          } else {
            isActive = pathName.startsWith(href);
          }

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-2 px-3 ${
                isActive ? "dock-active" : ""
              }`}
            >
              <Icon className="size-[1.2em]" />
              <span className="dock-label">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}