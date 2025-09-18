import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "../services/employee.service";
import { Employee } from "@/types/employee";
import { UpdateEmployeeDTO } from "../types/employee.type";
import { EmployeeFormValues } from "../schema/create-employee.schema";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// key buat cache query
const EMPLOYEES_KEY = ["employees"];
export type UpdatePayload = {
  id: string;
  data: UpdateEmployeeDTO | FormData;
};

interface EmployeesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string
}
interface EmployeeResponse {
  data: Employee[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}




export function useEmployees(params?: EmployeesParams & {search?: string}) {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: async () => {
      const res = await axiosInstance.get<EmployeeResponse>("/api/admin/employees", { params });
      return res.data; 
    },
    select: (response) => ({
      employees: response.data, 
      meta: response.meta,      
    }),
  
  });
}

export function useEmployee(id: string) {
  return useQuery<Employee>({
    queryKey: [...EMPLOYEES_KEY, id],
    queryFn: async () => {
    const res =  await employeeService.getById(id)
    return res
    },
    enabled: !!id, // biar ga jalan kalau id kosong
  });
}

export function useCreateEmployee() {
  const router = useRouter()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      const formData = new FormData();
      if (values.photoUrl) {
        formData.append("photo", values.photoUrl); // file
      }
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password || "");
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("address", values.address);
      formData.append("role", values.role);
      formData.append("outletId", values.outletId ?? "");
      formData.append("shiftId", values.shiftId);

      const res = await axiosInstance.post("/api/admin/employees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
      toast.success(`Employee created sucessfully`)
      router.replace(`/admin/employees`)
    },
    onError: async (error: any) => {
      if (error.response) {
        toast.error(error.response.data?.message ?? "Failed to create employee");
      } else {
        toast.error(error.message ?? "Unexpected error");
      }
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdatePayload) => {
      if (data instanceof FormData) {
        const res = await axiosInstance.patch(`/api/admin/employees/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
      }

      const res = await axiosInstance.patch(`/api/admin/employees/${id}`, data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employees", variables.id] });
      toast.success("Employee updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? error.message ?? "Failed to update employee");
    },
  });
}


export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/api/admin/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted successfully")
      router.push("/admin/employees")
    },
  });
};
