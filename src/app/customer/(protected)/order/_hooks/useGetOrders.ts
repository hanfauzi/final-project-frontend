import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type CustomerOrdersQuery = {
  page?: number;
  take?: number;
  status?: string;
  invoiceNo?: string;
  dateFrom?: string;
  dateTo?: string;
};

export default function useGetCustomerOrders(params: CustomerOrdersQuery) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (params.page) qs.set("page", String(params.page));
      if (params.take) qs.set("take", String(params.take));
      if (params.status) qs.set("status", params.status);
      if (params.invoiceNo) qs.set("invoiceNo", params.invoiceNo);
      if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
      if (params.dateTo) qs.set("dateTo", params.dateTo);

      const { data } = await axiosInstance.get<{
        data: Array<{
          id: string;
          invoiceNo: string | null;
          status: string;
          notes: string | null;
          createdAt: string;
          estHours: number | null;
        }>;
        meta: { page: number; take: number; total: number; totalPages: number };
      }>(`/api/order?${qs.toString()}`);

      return data;
    },
  });
}
