import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";

type CustomerProfile = {
    name: string,
    email: string,
    phoneNumber: string,
    photoUrl: string,
    isVerified: boolean 
}

const useGetCustomerProfile = () => {
  const { customer } = useAuthStore();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CustomerProfile>(
        "/api/profile/customer",
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

export default useGetCustomerProfile;
