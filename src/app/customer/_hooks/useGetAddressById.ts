// features/address/_hooks/useGetAddressById.ts
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import type { CustomerAddress } from "./useGetAddresses";

const useGetCustomerAddressById = (id: string | undefined) => {
  const { customer } = useAuthStore();

  return useQuery({
    queryKey: ["address", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CustomerAddress>(
        `/api/address/${id}`,
        {
          headers: {
            Authorization: `Bearer ${customer?.token}`,
          },
        }
      );
      return data; // service kamu return object langsung
    },
  });
};

export default useGetCustomerAddressById;
