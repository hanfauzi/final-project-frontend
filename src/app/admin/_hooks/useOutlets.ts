import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface Outlet {
  id: string;
  name: string;
}

interface GetOutletsResponse {
  data: Outlet[];
  message: string;
}

export function useOutlets() {
  return useQuery<Outlet[]>({
    queryKey: ["outlets"],
    queryFn: async () => {
      const res = await axiosInstance.get<GetOutletsResponse>("/api/admin/outlets");
      return res.data.data
    },
  });
}