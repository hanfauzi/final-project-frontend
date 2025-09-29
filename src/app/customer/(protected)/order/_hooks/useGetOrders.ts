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

type OrderListItem = {
  id: string;
  invoiceNo: string | null;
  status: string;
  createdAt: string;
  estHours: number | null;
  outlets: { id: string; name: string };
  deliveryOrder?: { id: string; status: string; price?: number } | null;
  serviceNames: string[];
  serviceLabel: string;
  amount: number;
  breakdown: {
    itemsTotal: number;
    pickupFeeApplied: number;
    deliveryFee: number;
  };
  isPaid?: boolean;
  paidAt?: string | null;
};

type ApiListResponse<T> = {
  data: T[];
  meta: { page: number; take: number; total: number; totalPages: number };
};

export default function useGetCustomerOrders(params: CustomerOrdersQuery) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (params.page != null) qs.set("page", String(params.page));
      if (params.take != null) qs.set("take", String(params.take));
      if (params.status) qs.set("status", params.status);
      if (params.invoiceNo) qs.set("invoiceNo", params.invoiceNo);
      if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
      if (params.dateTo) qs.set("dateTo", params.dateTo);

      const { data } = await axiosInstance.get<ApiListResponse<OrderListItem>>(
        `/api/order?${qs.toString()}`
      );
      return data;
    },
  });
}
