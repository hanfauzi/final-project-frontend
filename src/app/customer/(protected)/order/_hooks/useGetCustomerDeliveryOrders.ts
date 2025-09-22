"use client";

import { axiosInstance } from "@/lib/axios";
import { OrderStatus } from "@/types/orderStatus";
import { useQuery } from "@tanstack/react-query";

export type CustomerDeliveryQuery = {
  page?: number;
  take?: number;
  status?: string;       
  invoiceNo?: string;
  dateFrom?: string;     
  dateTo?: string;       
};

export type DeliveryOrderItem = {
  id: string;
  outletId: string;
  outlet: { id: string; name: string; cityName: string };
  customerAddressId: string;
  orderHeaderId: string;
  distance: number;
  price: number;
  status: string;
  scheduledAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  driver: { id: string; name: string; phoneNumber: string | null } | null;
  orderHeader: {
    id: string;
    invoiceNo: string | null;
    status: OrderStatus;      
    createdAt: string;
  };
};

type ApiListResponse<T> = {
  data: T[];
  meta: { page: number; take: number; total: number; totalPages: number };
};

export default function useGetCustomerDeliveryOrders(params: CustomerDeliveryQuery) {
  return useQuery({
    queryKey: ["delivery-orders", params],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (params.page != null) qs.set("page", String(params.page));
      if (params.take != null) qs.set("take", String(params.take));
      if (params.status) qs.set("status", params.status);
      if (params.invoiceNo) qs.set("invoiceNo", params.invoiceNo);
      if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
      if (params.dateTo) qs.set("dateTo", params.dateTo);

      const { data } = await axiosInstance.get<ApiListResponse<DeliveryOrderItem>>(
        `/api/order/deliveries?${qs.toString()}`
      );
      return data;
    },
  });
}
