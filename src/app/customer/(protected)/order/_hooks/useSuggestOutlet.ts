import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export type SuggestOutletResponse = {
  message: string;
  data: {
    outletId: string;
    outletName: string;
    distanceOutletKm: number;
  };
};

export default function useSuggestOutlet(customerAddressId?: string) {

  return useQuery({
    queryKey: ["suggest-outlet", customerAddressId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<SuggestOutletResponse>(
        "/api/order/suggest-outlet",
        {
          params: { customerAddressId },
          
        }
      );
      return data;
    },
  });
}
