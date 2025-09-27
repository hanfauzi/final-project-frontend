import { axiosInstance } from "@/lib/axios";
import { Employee } from "@/types/employee";

interface EmployeeResponse {
  message: string;
  data: Employee;
}

export const employeeService = {
  getById: async (id: string): Promise<Employee> => {
    const res = await axiosInstance.get<EmployeeResponse>(
      `/api/admin/employees/${id}`
    );
    return res.data.data;
  },
};
