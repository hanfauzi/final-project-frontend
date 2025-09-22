import { axiosInstance } from "@/lib/axios";
import { DeliveryOrder } from "@/types/deliveryOrder";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const useGetDeliveryOrderById = (
  id: string,
  options?: Omit<UseQueryOptions<DeliveryOrder>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<DeliveryOrder>({
    queryKey: ["delivery-order", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/delivery-order/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    ...options,
  });
};

export default useGetDeliveryOrderById;
