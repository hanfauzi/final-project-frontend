"use client";

import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface SalesReport {
  period: string;
  total: number;
}

interface SuperAdminParams {
  outletId?: string; 
  startDate?: string;
  endDate?: string;
}

export const useSuperAdminSalesReport = (params: SuperAdminParams) => {
  const { outletId, startDate, endDate } = params;

  return useQuery<SalesReport[]>({
    queryKey: ["sales-report-super-admin", params],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/sales-reports", {
        params: { outletId, startDate, endDate },
      });
      console.log("Fetched Sales Report Data:", res);

      return res.data; 
    },
  });
};
