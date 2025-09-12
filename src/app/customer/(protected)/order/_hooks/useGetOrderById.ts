import { axiosInstance } from "@/lib/axios";
import { CustomerOrder } from "@/types/customerOrders";
import { useQuery } from "@tanstack/react-query";

const useGetCustomerOrderById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CustomerOrder>(
        `/api/order/${id}`
      );
      return data;
    },
  });
};

export default useGetCustomerOrderById;
