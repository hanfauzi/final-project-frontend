"use client";

import useGetEmployee from "../_hooks/useGetEmployee";
import DriverTasks from "./_components/DriverTasks";

const TaskPage = () => {
  const { data: employee, isLoading: employeeLoading, error: employeeError } = useGetEmployee();

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
      return <div>No tasks available for worker yet</div>;
    default:
      return <div>No tasks available for your role</div>;
  }
}

export default TaskPage;