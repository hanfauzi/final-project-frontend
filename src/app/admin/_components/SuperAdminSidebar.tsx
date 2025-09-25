import { FC } from "react";
import SidebarItem from "./SidebarItem";
import { Separator } from "@/components/ui/separator";
import { Users, Home, Box, ClipboardList, CalendarArrowUp, ChartColumnIncreasing, ChartPie } from "lucide-react";
import EmployeeProfile from "@/components/EmployeeProfile";

const SuperAdminSidebar: FC = () => {
  return (
    <div className="w-64 h-screen p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Section Manage */}
      <div className="flex flex-col gap-1">
        <EmployeeProfile />
        <SidebarItem title="Dashboard" href="/admin" icon={<Home size={18} />} />
        <SidebarItem title="Manage Employees" href="/admin/employees" icon={<Users size={18} />} />
        <SidebarItem title="Manage Outlets" href="/admin/outlets" icon={<Box size={18} />} />
        <SidebarItem title="Manage Orders" href="/admin/orders" icon={<CalendarArrowUp size={18} />} />
        <SidebarItem title="Laundry Items" href="/admin/laundry-items" icon={<ClipboardList size={18} />} />
      </div>

      <Separator className="my-4" />

      {/* Section Info / Lainnya */}
      <div className="flex flex-col gap-1">
        <SidebarItem title="Sales Reports" href="/admin/sales" icon={<ChartColumnIncreasing size={18} />} />
        <SidebarItem title="Employee Performance" href="/admin/performances" icon={<ChartPie size={18} />} />
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
