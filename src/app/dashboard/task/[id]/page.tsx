"use client";

import { useEmployee } from "../../_context/EmployeeContext";
import WorkerTaskDetail from "./_components/WorkerTaskDetail";


export default function TaskDetailPage() {
  const { employee, isLoading: employeeLoading, error: employeeError } = useEmployee();

  if (employeeLoading) return (
    <div className="flex gap-2 items-center justify-center">
      <div className="loading loading-spinner text-primary"></div>
      <div>Loading employee data...</div>
    </div>
  );
  if (employeeError) return <div className="text-red-500">Error: {employeeError.message}</div>;;
  if (!employee) return (
    <div className="flex gap-2 items-center justify-center">
      <div className="loading loading-spinner text-primary"></div>
    </div>
  );

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