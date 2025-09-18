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
  getAll: async (params? : EmployeesParams): Promise<Employee[]> => {
    const res = await axiosInstance.get<EmployeeApiResponse>("/api/admin/employees");
    return res.data.data;
  },

  getById: async (id: string): Promise<Employee> => {
    const res = await axiosInstance.get<EmployeeResponse>(`/api/admin/employees/${id}`);
    return res.data.data;
  },

  create: async (data: CreateEmployeeDTO): Promise<Employee> => {
    const res = await axiosInstance.post<EmployeeResponse>("/api/admin/employees", data);
    return res.data.data;
  },

  update: async (id: string, data: UpdateEmployeeDTO): Promise<Employee> => {
    const res = await axiosInstance.patch<EmployeeResponse>(`/api/admin/employees/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<Employee> => {
    const res = await axiosInstance.delete<EmployeeResponse>(`/api/admin/employees/${id}`);
    return res.data.data;
  },
};
