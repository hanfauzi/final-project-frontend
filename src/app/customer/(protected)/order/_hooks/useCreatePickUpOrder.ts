import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type CreatePickupOrderPayload = {
  customerAddressId: string;
  services: string[] 
  receiverName: string
  receiverPhone: string
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
     services: string[]
  };
};

export default function useCreatePickupOrder() {
const router = useRouter();
  const queryClient = useQueryClient();

  const createPickUpOrderMutation = useMutation({
    mutationFn: async (payload: CreatePickupOrderPayload) => {
      const services = Array.from(new Set((payload.services ?? []).filter(Boolean)));
      const { data } = await axiosInstance.post<PickupOrderResponse>(
        "/api/order/create",
        {...payload,services}

      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickup-orders"] });
      toast.success("Pickup order berhasil dibuat");
      router.replace("/customer/order");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Gagal membuat order");
    },
  });

  return { createPickUpOrderMutation };
}
