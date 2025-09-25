// hooks/usePerformance.ts
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface PerformanceData {
  workers: Array<{
    employeeId: string;
    employeeName?: string;
    role?: string;
    outletId?: string;
    totalDone: number;
    target: number;
  }>;
  drivers: Array<{
    employeeId: string;
    employeeName?: string;
    role?: string;
    outletId?: string;
    totalDone: number;
    target: number;
  }>;
}

export const usePerformance = (startDate: string, endDate: string, outletId?: string) => {
  return useQuery<PerformanceData>({
    queryKey: ["performance", startDate, endDate, outletId || ""],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/admin/performance-reports", {
        params: { startDate, endDate, outletId },
      });
      return data;
    },
  });
};
