import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface Shift {
  id: string;
  name: string;
}

interface GetShiftResponse {
    data: Shift[];
    message: string;
}

export function useShifts() {
  return useQuery<Shift[]>({
    queryKey: ["shifts"],
    queryFn: async () => {
      const res = await axiosInstance.get<GetShiftResponse>("/api/admin/shifts");
      return res.data.data
    },
  });
}