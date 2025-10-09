"use client";

import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useProcessPickUpOrder = () => {
  const queryClient = useQueryClient();
  const { employee } = useAuthStore();

  return useMutation({
    mutationFn: async (pickupOrderId: string) => {
      if (!employee?.token) {
        throw new Error("No token available");
      }

      await axiosInstance.patch(
        `/api/pickup-order/${pickupOrderId}/process-pickup-order`,
        {},
        {
          headers: { Authorization: `Bearer ${employee.token}` },
        }
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["pickup-order"] }),
        queryClient.invalidateQueries({ queryKey: ["employee"] }),
      ]);
      toast.success("Pick-up order processed successfully!");
    },
    onError: (error: AxiosError<{ message: string; code: number }>) => {
      toast.error(error.response?.data.message ?? "Failed to process pickup order!");
    },
  });
};

export default useProcessPickUpOrder;
