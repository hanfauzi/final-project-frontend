"use client";

import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface SalesReportData {
  period: string;
  total: number;
}

export function useSalesReportsOutletAdmin(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery<SalesReportData[]>({
    queryKey: ["salesReportsOutletAdmin", params],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/sales-reports/outlet", { params });
      return res.data;
    },
  });
}
