import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { CustomerAddress } from "./useGetAddresses";

const useGetCustomerAddressById = (id: string | undefined) => {

  return useQuery({
    queryKey: ["address", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CustomerAddress>(
        `/api/address/${id}`,

      );
      return data; 
    },
  });
};

export default useGetCustomerAddressById;
