import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface LaundryService {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
}

export const useLaundryServices = () =>
  useQuery({
    queryKey: ["laundry-services"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/laundry-services");
      return res.data.data; 
    },
  });
