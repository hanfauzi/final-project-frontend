import { FC } from "react";
import { Separator } from "@/components/ui/separator";
import { Home, NotebookPen, CalendarClock, Settings } from "lucide-react";
import SidebarItem from "@/app/admin/_components/SidebarItem";

const DashboardSidebar: FC = () => {
  return (
    <div className="w-64 h-full p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex flex-col gap-1">
        <SidebarItem title="Dashboard" href="/dashboard" icon={<Home size={18} />} />
        <SidebarItem title="Attendance" href="/dashboard/attendance" icon={<CalendarClock size={18} />} />
        <SidebarItem title="Task" href="/dashboard/task" icon={<NotebookPen size={18} />} />
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-1">
        <SidebarItem title="Setting" href="#setting" icon={<Settings size={18} />} />
      </div>
    </div>
  );
};

export default DashboardSidebar;
