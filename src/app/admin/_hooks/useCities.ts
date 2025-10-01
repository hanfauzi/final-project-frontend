import { axiosInstance } from "@/lib/axios";
import { City } from "@/types/city";
import { useQuery } from "@tanstack/react-query";

export const useCities = () =>
  useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/cities");
      return res.data.data; 
    },
  });