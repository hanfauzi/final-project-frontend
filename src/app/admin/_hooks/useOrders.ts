// app/admin/_hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export interface Order {
  id: string;
  outletId: string;
  createdAt: string;
  invoiceNo: string;
  customers?: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  outlets?: {
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
  };
}

interface GetAllOrdersResponse {
  data: Order[];
  meta: {
    totalPages: number;
    total: number;
    page: number;
    limit: number;
  };
  message: string;
}

export function useOrders(params?: {
  page?: number;
  limit?: number;
  outletId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery<GetAllOrdersResponse>({
    queryKey: ["orders", params],
    queryFn: async () => {
      const res = await axiosInstance.get<GetAllOrdersResponse>(
        "/api/admin/orders",
        { params }
      );
      return res.data;
    },
  });
}
