"use client";

import { useEmployee } from "../_context/EmployeeContext";
import DriverTasks from "./_components/DriverTasks";
import WorkerTask from "./_components/WorkerTask";

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
      return <div>No tasks available for outlet admin yet</div>;
    case "DRIVER":
      return <DriverTasks />;
    case "WORKER":
      return <WorkerTask />;
    default:
      return <div>No tasks available for your role</div>;
  }
}

export default TaskPage;