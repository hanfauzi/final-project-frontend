import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useCities = () =>
  useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/cities");
      return res.data.data; 
    },
  });