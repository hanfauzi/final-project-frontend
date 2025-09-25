import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useLaundryServices = () =>
  useQuery({
    queryKey: ["laundry-services"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/admin/laundry-services");
      return data;
    },
  });
