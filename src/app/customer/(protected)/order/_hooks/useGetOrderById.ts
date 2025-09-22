import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type CustomerOrder = {
  id: string;
  outletId: string;
  status: string;
  notes: string | null;
  estHours: number | null;
  createdAt: string;
  updatedAt: string;
  invoiceNo: string | null;
  outlets?: { name: string } | null;
  deliveryOrder?: { id: string; status: string } | null;
  serviceLabel: string;
  items: Array<{
    id: string;
    qty: number;
    unitPrice: number;
    subTotal: number;
    service: { id: string; name: string; unit: string };
  }>;
};

const useGetCustomerOrderById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axiosInstance.get<CustomerOrder>(
        `/api/order/${id}`
      );
      return data;
    },
  });
};

export default useGetCustomerOrderById;
