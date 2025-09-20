import { axiosInstance } from "@/lib/axios";
import { Employee } from "@/types/employee";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../types/employee.type";

interface EmployeeApiResponse {
  data: Employee[];
}

interface EmployeeResponse {
  message: string;
  data: Employee;
}

interface EmployeesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const employeeService = {

  getById: async (id: string): Promise<Employee> => {
    const res = await axiosInstance.get<EmployeeResponse>(`/api/admin/employees/${id}`);
    return res.data.data;
  },

  

  
};
