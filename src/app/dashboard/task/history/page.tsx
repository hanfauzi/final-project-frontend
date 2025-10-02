"use client";

import WorkerTaskHistory from "./_components/WorkerTaskHistory";
import DriverTaskHistory from "./_components/DriverTaskHistory";
import { useEmployee } from "../../_context/EmployeeContext";

const TaskPage = () => {
  const { employee, isLoading: employeeLoading, error: employeeError } = useEmployee();

  if (employeeLoading) return (
    <div className="flex gap-2 items-center justify-center">
      <div className="loading loading-spinner text-primary"></div>
      <div>Loading employee data...</div>
    </div>
  );
  if (employeeError) return <div className="text-red-500">Error: {employeeError.message}</div>;
  if (!employee) return <div></div>;

  switch (employee.role) {
    case "OUTLET_ADMIN":
      return <div>No tasks history available for outlet admin yet</div>;
    case "DRIVER":
      return <DriverTaskHistory />;
    case "WORKER":
      return <WorkerTaskHistory />;
    default:
      return <div>You are not supposed to be here 😊</div>;
  }
}

export default TaskPage;