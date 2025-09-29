"use client";

import { axiosInstance } from "@/lib/axios";
import { Customer } from "@/types/customer";
import { OrderHeader } from "@/types/orderHeader";
import { OrderItemType } from "@/types/orderItem";
import { Outlet } from "@/types/outlet";
import { WorkerTask } from "@/types/workerTasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface Order {
  id: string;
  invoiceNo: string;
  customers: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  status: string;
  totalPrice: number;
  createdAt: string;
}

export interface PickupOrders {
  id: string;
  customerId: string;
  driverId: string;
  outletId: string;
  status: string;
  customerAddressId: string;
  notes: string;
}

interface GetOrdersResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export interface LaundryItemInput {
  laundryItemId: string;
  qty: number;
}

export interface OrderItemInput {
  serviceId: string;
  qty: number;
  unitPrice?: number;
  note?: string;
  laundryItems?: LaundryItemInput[];
}

export interface CreateOrderFromPickupDTO {
  pickupOrderId: string;
  notes?: string;
  items: OrderItemInput[];
}
export interface GetPickupOrdersResponse {
  data: PickupOrders[];
  message: string;
}
export interface OrderDetail extends OrderHeader {
  OrderItem: OrderItemType[]
  workerTasks: WorkerTask[];
  customers: Customer;
  outlets: Outlet;

  itemsTotal: number;
  pickupPrice: number;
  total: number;
  message?: string;
}

export function useOutletOrders(
  params?: Record<string, any>,
  options?: { enabled?: boolean }
) {
  return useQuery<GetOrdersResponse>({
    queryKey: ["outlet-orders", params],
    queryFn: async () => {
      const res = await axiosInstance.get<GetOrdersResponse>(
        "/api/admin/orders/outlet",
        { params }
      );
      return res.data;
    },
    enabled: options?.enabled ?? true,
  });
}

export const useOrderDetail = (orderId: string) => {
  return useQuery<OrderDetail>({
    queryKey: ["orderDetail", orderId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/admin/orders/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });
};

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

export function useCreateOrderFromPickup() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: CreateOrderFromPickupDTO) => {
      const res = await axiosInstance.post(
        `/api/admin/orders/:pickUpOrderId/create`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pickup-orders"] });
      toast.success("Order created successfully!");
      router.replace("/outlet-admin/orders");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || "Failed to create order");
    },
  });
}
