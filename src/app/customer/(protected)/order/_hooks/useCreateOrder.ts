import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type CreatePickupOrderPayload = {
  customerAddressId: string;
  notes?: string | null; 
};

export type PickupOrderResponse = {
  message: string;
  data: {
    id: string;
    outletId: string;
    status: string;
    createdAt: string;
    estHours: number | null;
    distanceOutletKm: number;
    outlets: { name: string };
  };
};

export default function useCreatePickupOrder() {
const router = useRouter();
  const queryClient = useQueryClient();

  const createPickUpOrderMutation = useMutation({
    mutationFn: async (payload: CreatePickupOrderPayload) => {
      const { data } = await axiosInstance.post<PickupOrderResponse>(
        "/api/order/create",
        payload,

      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast.success("Pickup order berhasil dibuat");
      router.replace("/customer/order");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Gagal membuat order");
    },
  });

  return { createPickUpOrderMutation };
}
