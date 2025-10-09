"use client";

import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useProcessDeliveryOrder = () => {
  const queryClient = useQueryClient();
  const { employee } = useAuthStore();

  return useMutation({
    mutationFn: async (deliveryOrderId: string) => {
      if (!employee?.token) {
        throw new Error("No token available");
      }

      await axiosInstance.patch(
        `/api/delivery-order/${deliveryOrderId}/process-delivery-order`,
        {},
        {
          headers: { Authorization: `Bearer ${employee.token}` },
        }
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["delivery-order"] }),
        queryClient.invalidateQueries({ queryKey: ["employee"] }),
      ]);
      toast.success("Delivery order processed successfully!");
    },
    onError: (error: AxiosError<{ message: string; code: number }>) => {
      toast.error(error.response?.data.message ?? "Failed to process delivery order!");
    },
  });
};

export default useProcessDeliveryOrder;
