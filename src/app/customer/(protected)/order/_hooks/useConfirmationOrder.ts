"use client";

import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ConfirmArgs = {
  orderHeaderId: string;
  deliveryId?: string;    
  redirectTo?: string;     
};

export default function useConfirmationOrder() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const confirmationOrderMutation = useMutation({
    mutationFn: async ({ orderHeaderId }: ConfirmArgs) => {
      const { data } = await axiosInstance.patch(`/api/order/confirm/${orderHeaderId}`);
      return data;
    },
    onSuccess: async (res, { orderHeaderId, deliveryId, redirectTo }) => {
      toast.success(res?.message ?? "Order berhasil dikonfirmasi.");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["order", orderHeaderId] }),
        queryClient.invalidateQueries({ queryKey: ["delivery-orders"] }),
        deliveryId
          ? queryClient.invalidateQueries({ queryKey: ["delivery-order", deliveryId] })
          : Promise.resolve(),
      ]);

      if (redirectTo) router.replace(redirectTo);
      else router.refresh();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message ?? "Gagal mengkonfirmasi order.");
    },
  });

  return { confirmationOrderMutation };
}