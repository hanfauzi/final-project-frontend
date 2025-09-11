// features/address/_hooks/useGetAddressById.ts
import { axiosInstance } from "@/lib/axios";
import { CustomerOrder } from "@/types/customerOrders";
import { useQuery } from "@tanstack/react-query";

const useGetCustomerOrderById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CustomerOrder>(
        `/api/order/${id}`
      );
      return data;
    },
  });
};

export default useGetCustomerOrderById;
