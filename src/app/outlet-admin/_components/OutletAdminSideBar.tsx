"use client";

import SidebarItem from "@/app/admin/_components/SidebarItem";
import DashboardLogoutButton from "@/app/dashboard/_components/DashboardLogoutButton";
import EmployeeProfile from "@/components/EmployeeProfile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bike,
  CalendarArrowUp,
  ChartPie,
  ClipboardList,
  Home,
  Menu,
  TicketCheck,
} from "lucide-react";
import { FC } from "react";
import { useBypassRequest } from "../_hooks/useBypassRequest";

const OutletAdminSidebar: FC = () => {
  const { data: bypassRequests } = useBypassRequest();
  const pendingCount =
    bypassRequests?.filter((req) => req.bypassReq)?.length ?? 0;

  return (
    <>
      <div className="md:hidden absolute top-2 left-2 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-54">
            <SheetHeader>
              <SheetTitle className="sr-only">Sidebar Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent pendingCount={pendingCount} />
          </SheetContent>
        </Sheet>
      </div>

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
        <SidebarContent pendingCount={pendingCount} />
      </aside>
    </>
  );
};

const SidebarContent: FC<{ pendingCount: number }> = ({ pendingCount }) => (
  <>
    {/* Section Manage */}
    <div className="flex flex-col gap-1">
      <EmployeeProfile />
      <SidebarItem
        title="Dashboard"
        href="/outlet-admin"
        icon={<Home size={18} />}
      />
      <SidebarItem
        title="Manage Orders"
        href="/outlet-admin/orders"
        icon={<CalendarArrowUp size={18} />}
      />
      <SidebarItem
        title="Pickup Orders"
        href="/outlet-admin/orders/pick-up"
        icon={<Bike size={18} />}
      />
      <SidebarItem
        title="Bypass Request"
        href="/outlet-admin/bypass"
        icon={<TicketCheck size={18} />}
        badge={pendingCount}
      />
    </div>

    <Separator className="my-4" />

    {/* Section Info / Lainnya */}
    <div className="flex flex-col gap-1">
      <SidebarItem
        title="Sales Reports"
        href="/outlet-admin/sales"
        icon={<ClipboardList size={18} />}
      />
      <SidebarItem
        title="Employee Performance"
        href="/outlet-admin/performances"
        icon={<ChartPie size={18} />}
      />
    </div>

    <div className="mt-auto mx-auto pb-10">
      <DashboardLogoutButton />
    </div>
  </>
);

export default OutletAdminSidebar;
