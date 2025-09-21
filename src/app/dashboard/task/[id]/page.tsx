"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useGetEmployee from "../../_hooks/useGetEmployee";
import WorkerTaskDetail from "./_components/WorkerTaskDetail";


export default function TaskDetailPage() {
  const { data: employee, isLoading: employeeLoading, error: employeeError } = useGetEmployee();

  if (employeeLoading) return <Skeleton className="h-10 w-full" />;
  if (employeeError) return <div>Error: {employeeError.message}</div>;
  if (!employee) return <div>No task data</div>;

  switch (employee.role) {
    case "DRIVER":
      return <div>Oops.. You opened the wrong page for the driver task</div>;
    case "WORKER":
      return <WorkerTaskDetail />;
    case "OUTLET_ADMIN":
      return <div>No task detail available for admin</div>;
    default:
      return <div>No task detail available for this role</div>;
  }
}