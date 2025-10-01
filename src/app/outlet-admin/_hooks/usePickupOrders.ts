"use client";

import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export enum PickupStatus {
  WAITING_FOR_DRIVER = "WAITING_FOR_DRIVER",
  ON_THE_WAY_TO_CUSTOMER = "ON_THE_WAY_TO_CUSTOMER",
  ON_THE_WAY_TO_OUTLET = "ON_THE_WAY_TO_OUTLET",
  RECEIVED_BY_OUTLET = "RECEIVED_BY_OUTLET",
  CANCELLED = "CANCELLED",
}

export interface PickupOrders {
  id: string;
  customerId: string;
  driverId: string;
  outletId: string;
  status: string;
  customerAddressId: string;
  notes: string;
  price: number;
   createdAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
  };
  outlet?: {
    id: string;
    name: string;
    address: string;
  };
  customerAddress?: {
    id: string;
    street: string;
    city: string;
    postalCode: string;
  };
  services: {
    id: string;
    name: string;
    basePrice: number;
    estHours?: number;
  }[];
   orderHeaders?: {
    id: string;
    totalPrice: number;
    status: string;
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
