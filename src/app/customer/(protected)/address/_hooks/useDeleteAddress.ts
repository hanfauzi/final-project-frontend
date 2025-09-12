// src/app/customer/_hooks/useDeleteAddress.ts
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type DeleteAddressResponse = {
  message: string; 
};

export default function useDeleteCustomerAddress() {
  const queryClient = useQueryClient();

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete<DeleteAddressResponse>(
        `/api/address/delete/${id}`,
     
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
      toast.success("Alamat berhasil dihapus");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message ?? "Gagal menghapus alamat");
    },
  });

  return { deleteAddressMutation };
}
