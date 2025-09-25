import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";

export const useEmployeeProfile = () => {
  const employeeId = useAuthStore((s) => s.employee?.id);

  return useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      const res = await axiosInstance.get(`/api/admin/employees/${employeeId}`);
      return res.data.data;
    },
    enabled: !!employeeId, // hanya jalan kalau ada id
  });
};