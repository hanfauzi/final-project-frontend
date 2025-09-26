"use client";

import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface PickupOrders {
  id: string;
  customerId: string;
  driverId: string;
  outletId: string;
  status: string;
  customerAddressId: string;
  notes: string;
  price: number;
  services: {
    id: string;
    name: string;
    basePrice: number;
    estHours?: number;
  }[];
}

export interface GetPickupOrdersResponse {
  data: PickupOrders[];
  message: string;
}
export interface PickupOrderDetail {
  id: string;
  status: string;
  notes: string | null;
  customer: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  outlet: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface GetPickupOrderDetailResponse {
  data: PickupOrderDetail;
  message: string;
}

export const usePickupOrders = () => {
  return useQuery({
    queryKey: ["pickupOrders"],
    queryFn: async () => {
      const res = await axiosInstance.get<GetPickupOrdersResponse>(
        "/api/admin/orders/pickup-orders"
      );
      return res.data.data;
    },
  });
};

export function usePickupOrderDetail(pickupOrderId: string) {
  return useQuery({
    queryKey: ["pickup-order-detail", pickupOrderId],
    queryFn: async () => {
      const res = await axiosInstance.get<GetPickupOrderDetailResponse>(
        `/api/admin/orders/pickup-orders/${pickupOrderId}`
      );
      return res.data.data;
    },
    enabled: !!pickupOrderId,
  });
}
