import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role?: string;
}

interface GetAssignedEmployeesResponse {
  message: string;
  data: Employee[];
}

interface AssignEmployeePayload {
  employeeId: string;
  outletId: string | null;
}

interface AssignEmployeeResponse {
  message: string;
  data: Employee;
}

export function useAssignedEmployeesByOutlet(outletId: string) {
  return useQuery<Employee[]>({
    queryKey: ["assignedEmployees", outletId],
    queryFn: async () => {
      const res = await axiosInstance.get<GetAssignedEmployeesResponse>(
        `/api/admin/outlets/${outletId}/employees`
      );
      return res.data.data;
    },
    enabled: !!outletId,
  });
}

export function useAssignEmployeeToOutlet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ employeeId, outletId }: AssignEmployeePayload) => {
      const res = await axiosInstance.patch<AssignEmployeeResponse>(
        `/api/admin/outlets/${outletId}/assign`,
        { employeeId }
      );
      return res.data;
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignedEmployees", variables.outletId],
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(res.message || "Employee assigned to outlet successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message || "Failed to assign employee to outlet";
      toast.error(message);
    },
  });
}
