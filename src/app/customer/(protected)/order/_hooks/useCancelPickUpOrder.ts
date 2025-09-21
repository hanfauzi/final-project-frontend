import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type CancelOrderResponse = {
  message: string;
};

export default function useCancelPickUpOrder() {
  const qc = useQueryClient();

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await axiosInstance.post<CancelOrderResponse>(
        `/api/order/cancel/${orderId}`
      );
      return data;
    },
    onSuccess: (res, orderId) => {
      toast.success(res?.message ?? "Order berhasil dibatalkan.");
      qc.invalidateQueries({ queryKey: ["pickup-orders"] });
      qc.invalidateQueries({ queryKey: ["pickup-orders", orderId] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message ?? "Gagal membatalkan order.");
    },
  });

  return { cancelOrderMutation };
}
