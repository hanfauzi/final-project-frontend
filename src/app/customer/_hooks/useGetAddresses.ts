import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";

export type CustomerAddress = {
  id: string;
  label: string;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  notes: string | null;
  isPrimary: boolean;
};


const useGetCustomerAddresses = () => {
  const { customer } = useAuthStore();
  return useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CustomerAddress[]>(
        "/api/address/",
        {
          headers: {
            Authorization: `Bearer ${customer?.token}`,
          },
        }
      );
      return data;
    },
  });
};

export default useGetCustomerAddresses;
