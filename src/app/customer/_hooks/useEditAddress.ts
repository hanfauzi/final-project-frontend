// src/app/customer/_hooks/useEditAddress.ts
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export type LabelEnum = "HOME" | "OFFICE" | "APARTMENT" | "OTHER";

export interface EditCustomerAddressPayload {
  label: LabelEnum;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  notes?: string | null;
  isPrimary?: boolean;
}


export default function useEditCustomerAddress(id: string) {
  const queryClient = useQueryClient();
  const { customer } = useAuthStore();

  const editAddressMutation = useMutation({
    mutationFn: async (payload: EditCustomerAddressPayload) => {
      const { data } = await axiosInstance.patch(
        `/api/address/edit/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${customer?.token}`,
          },
        }
      );
      return data; 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
      queryClient.invalidateQueries({ queryKey: ["address", id] });
      toast.success("Alamat berhasil diperbarui!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message ?? "Gagal memperbarui alamat.");
    },
  });

  return { editAddressMutation };
}
