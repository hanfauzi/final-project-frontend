import { axiosInstance } from "@/lib/axios";
import { CustomerOrder } from "@/types/customerOrders";
import { OrderStatus } from "@/types/orderStatus";
import { useQuery } from "@tanstack/react-query";

type OrdersFilter = {
  status?: OrderStatus;
};

export default function useGetCustomerOrders(filter?: OrdersFilter) {
  return useQuery({
    queryKey: ["orders", filter],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CustomerOrder[]>("/api/order");
      return data;
    },
    select: (orders) => {
      const filtered = filter?.status
        ? orders.filter((o) => o.status === filter.status)
        : orders;
      return [...filtered].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });
}
