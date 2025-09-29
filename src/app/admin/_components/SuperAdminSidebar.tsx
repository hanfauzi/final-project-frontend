"use client";

import EmployeeProfile from "@/components/EmployeeProfile";
import { Separator } from "@/components/ui/separator";
import {
  Box,
  CalendarArrowUp,
  ChartColumnIncreasing,
  ChartPie,
  ClipboardList,
  Home,
  Menu,
  Users,
} from "lucide-react";
import { FC } from "react";
import SidebarItem from "./SidebarItem";

// shadcn
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

const SuperAdminSidebar: FC = () => {
  return (
    <>
      {/* 🔹 Mobile: pakai Sheet */}
      <div className="md:hidden p-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4 w-64">
            <SheetHeader>
              <SheetTitle className="sr-only">Sidebar Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* 🔹 Desktop: tetap static */}
      <aside
        className="
          hidden md:flex
          w-64 min-h-screen
          p-4 border-r border-gray-200 dark:border-gray-700
          flex-col flex-shrink-0
          overflow-y-auto
          bg-white dark:bg-gray-900
        "
      >
        <SidebarContent />
      </aside>
    </>
  );
};

const SidebarContent = () => (
  <>
    {/* Section Manage */}
    <div className="flex flex-col gap-1">
      <EmployeeProfile />
      <SidebarItem title="Dashboard" href="/admin" icon={<Home size={18} />} />
      <SidebarItem
        title="Manage Employees"
        href="/admin/employees"
        icon={<Users size={18} />}
      />
      <SidebarItem
        title="Manage Outlets"
        href="/admin/outlets"
        icon={<Box size={18} />}
      />
      <SidebarItem
        title="Manage Orders"
        href="/admin/orders"
        icon={<CalendarArrowUp size={18} />}
      />
      <SidebarItem
        title="Laundry Items"
        href="/admin/laundry-items"
        icon={<ClipboardList size={18} />}
      />
    </div>

    <Separator className="my-4" />

    {/* Section Info / Lainnya */}
    <div className="flex flex-col gap-1">
      <SidebarItem
        title="Sales Reports"
        href="/admin/sales"
        icon={<ChartColumnIncreasing size={18} />}
      />
      <SidebarItem
        title="Employee Performance"
        href="/admin/performances"
        icon={<ChartPie size={18} />}
      />
    </div>
  </>
);

export default SuperAdminSidebar;
