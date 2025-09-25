import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface EmployeePerformance {
  employeeName: string;
  totalDone: number;
}

interface PerformanceData {
  workers: EmployeePerformance[];
  drivers: EmployeePerformance[];
}

export const useOutletAdminPerformance = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["outletAdminPerformance", startDate, endDate], // <<-- queryKey
    queryFn: async (): Promise<PerformanceData> => {           // <<-- queryFn
      const { data } = await axiosInstance.get("/api/admin/performance-reports/outlet", {
        params: { startDate, endDate },
      });
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
