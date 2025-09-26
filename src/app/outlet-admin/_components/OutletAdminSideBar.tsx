import SidebarItem from "@/app/admin/_components/SidebarItem";
import EmployeeProfile from "@/components/EmployeeProfile";
import { Separator } from "@/components/ui/separator";
import { Bike, CalendarArrowUp, ChartPie, ClipboardList, Home, TicketCheck } from "lucide-react";
import { FC } from "react";

const OutletAdminSidebar: FC = () => {
  return (
    <div className="w-64 h-screen p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Section Manage */}
      <div className="flex flex-col gap-1">
        <EmployeeProfile />
        <SidebarItem title="Dashboard" href="/outlet-admin" icon={<Home size={18} />} />
        <SidebarItem title="Manage Orders" href="/outlet-admin/orders" icon={<CalendarArrowUp size={18} />} />
        <SidebarItem title="Pickup Orders" href="/outlet-admin/orders/pick-up" icon={<Bike size={18} />} />
        <SidebarItem title="Bypass Request" href="/outlet-admin/bypass" icon={<TicketCheck size={18} />} />
      </div>

      <Separator className="my-4" />

      {/* Section Info / Lainnya */}
      <div className="flex flex-col gap-1">
        <SidebarItem title="Sales Reports" href="/outlet-admin/sales" icon={<ClipboardList size={18} />} />
        <SidebarItem title="Employee Performance" href="/outlet-admin/performances" icon={<ChartPie size={18} />} />
      </div>
    </div>
  );
};

export default OutletAdminSidebar;
