"use client";

import { usePathname } from "next/navigation";
import Dock from "./_components/DashboardDock";
import Navbar from "./_components/DashboardNavbar";
import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardClientAuth from "./DashboardClientAuth";
import { EmployeeProvider } from "./_context/EmployeeContext";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/employee/login";

  return (
    <EmployeeProvider>
      <main className="bg-neutral-50">
        {!hideLayout && <Navbar />}
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="hidden md:block">
            {!hideLayout && <DashboardSidebar />}
          </div>
          <main className="flex-1 min-w-0 overflow-x-hidden">
            <DashboardClientAuth>
              {children}
            </DashboardClientAuth>
          </main>
        </div>
        <div className="block md:hidden">
          {!hideLayout && <Dock />}
        </div>
      </main>
    </EmployeeProvider>
  )
}