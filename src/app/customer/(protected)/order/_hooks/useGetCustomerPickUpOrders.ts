"use client";

import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type CustomerPickupQuery = {
  page?: number;
  take?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type PickupOrderItem = {
  id: string;
  outletId: string;
  outlet: { id: string; name: string; cityName: string };
  customerAddressId: string;
  notes: string | null;
  distance: number;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  receiverName: string;
  receiverPhone: string;
  orderHeaders: Array<{
    id: string;
    invoiceNo: string | null;
    status: string;
    createdAt: string;
  }>;
  _count: { orderHeaders: number };
};

type ApiListResponse<T> = {
  data: T[];
  meta: { page: number; take: number; total: number; totalPages: number };
};

export default function useGetCustomerPickUpOrders(
  params: CustomerPickupQuery
) {
  return useQuery({
    queryKey: ["pickup-orders", params],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (params.page != null) qs.set("page", String(params.page));
      if (params.take != null) qs.set("take", String(params.take));
      if (params.status) qs.set("status", params.status);
      if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
      if (params.dateTo) qs.set("dateTo", params.dateTo);

      const { data } = await axiosInstance.get<
        ApiListResponse<PickupOrderItem>
      >(`/api/order/pickups?${qs.toString()}`);
      return data;
    },
  });
}
