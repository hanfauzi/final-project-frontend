// src/app/customer/_hooks/useSetPrimaryAddress.ts
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function useSetPrimaryCustomerAddress(id: string) {
  const queryClient = useQueryClient();

  const setPrimaryMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.patch(
        `/api/address/primary/${id}`,
        undefined,

      );
      return data; 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
      queryClient.invalidateQueries({ queryKey: ["address", id] });
      toast.success("Alamat dijadikan utama.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message ?? "Gagal menjadikan alamat utama.");
    },
  });

  return { setPrimaryMutation };
}
