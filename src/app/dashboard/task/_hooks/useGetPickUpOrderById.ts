import { axiosInstance } from "@/lib/axios";
import { PickUpOrder } from "@/types/pickUpOrder";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const useGetPickUpOrderById = (
  id: string,
  options?: Omit<UseQueryOptions<PickUpOrder>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PickUpOrder>({
    queryKey: ["pickup-order", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/pickup-order/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    ...options,
  });
};

export default useGetPickUpOrderById;
