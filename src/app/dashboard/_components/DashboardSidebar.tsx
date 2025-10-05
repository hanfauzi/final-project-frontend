import SidebarItem from "@/app/admin/_components/SidebarItem";
import { Separator } from "@/components/ui/separator";
import { CalendarClock, Home, NotebookPen } from "lucide-react";
import { FC } from "react";

const DashboardSidebar: FC = () => {
  return (
    <div className="w-64 h-full p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex flex-col gap-1">
        <SidebarItem title="Dashboard" href="/dashboard" icon={<Home size={18} />} />
        <SidebarItem title="Attendance" href="/dashboard/attendance" icon={<CalendarClock size={18} />} />
        <SidebarItem title="Task" href="/dashboard/task" icon={<NotebookPen size={18} />} />
      </div>

      <Separator className="my-4" />
    </div>
  );
};

export default DashboardSidebar;
