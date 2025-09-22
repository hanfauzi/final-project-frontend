"use client";

import { axiosInstance } from "@/lib/axios";
import { OrderStatus } from "@/types/orderStatus";
import { useQuery } from "@tanstack/react-query";

export type DeliveryOrderDetail = {
  id: string;
  status: string;
  distance: number;
  price: number;
  scheduledAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  outlet: { id: string; name: string; cityName: string; address: string };
  driver: { id: string; name: string; phoneNumber: string | null } | null;
  customerAddress: {
    id: string;
    label: string | null;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    phoneNumber: string | null;
  };
  orderHeader: {
    id: string;
    invoiceNo: string | null;
    status: OrderStatus; 
    createdAt: string;
  };
};

export default function useGetCustomerDeliveryOrderById(id: string | undefined) {
  return useQuery({
    queryKey: ["delivery-order", id],
    enabled: Boolean(id), 
    queryFn: async () => {
      const { data } = await axiosInstance.get<DeliveryOrderDetail>(
        `/api/order/delivery/${id}`
      );
      return data;
    },
  });
}
