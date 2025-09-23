"use client";
import { FC, ReactNode } from "react";
import Sidebar from "./SuperAdminSidebar";
import SuperAdminSidebar from "./SuperAdminSidebar";
import OutletAdminSidebar from "@/app/outlet-admin/_components/OutletAdminSideBar";
import { useAuthStore } from "@/stores/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardAdminLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const {employee} = useAuthStore()
  const role = employee?.role
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {role === "SUPER_ADMIN" ? <SuperAdminSidebar /> : <OutletAdminSidebar />}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardAdminLayout;
