import { axiosInstance } from "@/lib/axios";
import { CustomerPickUpOrderDetail } from "@/types/customerPickUpOrder";
import { useQuery } from "@tanstack/react-query";

const useGetCustomerPickUpOrderById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["pickup-orders", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CustomerPickUpOrderDetail>(
        `/api/order/pickup/${id}`
      );
      return data;
    },
  });
};

export default useGetCustomerPickUpOrderById;
