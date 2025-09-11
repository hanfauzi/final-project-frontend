// src/app/customer/_hooks/useCreatePickupOrder.ts
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
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

  const createPickUpOrderMutation = useMutation({
    mutationFn: async (payload: CreatePickupOrderPayload) => {
      const { data } = await axiosInstance.post<PickupOrderResponse>(
        "/api/order/create",
        payload,

      );
      return data;
    },
    onSuccess: () => {
      toast.success("Your pickup order has been created successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Something went wrong!");
    },
  });

  return { createPickUpOrderMutation };
}
