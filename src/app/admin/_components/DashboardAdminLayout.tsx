"use client";
import OutletAdminSidebar from "@/app/outlet-admin/_components/OutletAdminSideBar";
import { useAuthStore } from "@/stores/auth";
import { FC, ReactNode } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}


const DashboardAdminLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const {employee} = useAuthStore()
  const role = employee?.role

  const renderSidebar = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return <SuperAdminSidebar />;
      case "OUTLET_ADMIN":
        return <OutletAdminSidebar />;
      default:
        return null; 
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {renderSidebar()}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">{children}</main>
    </div>
  );
};

export default DashboardAdminLayout;
