import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type CustomerProfile = {
    name: string,
    email: string,
    phoneNumber: string,
    photoUrl: string,
    isVerified: boolean 
}

const useGetCustomerProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CustomerProfile>(
        "/api/profile/customer", 
        
      );
      return data;
    },
  });
};

export default useGetCustomerProfile;
