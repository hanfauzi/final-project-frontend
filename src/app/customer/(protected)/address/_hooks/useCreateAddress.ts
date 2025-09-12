// src/app/customer/_hooks/useCreateAddress.ts
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { LabelEnum } from "./useEditAddress";

export type CreateCustomerAddressPayload = {
  label: LabelEnum;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  notes?: string | null;
  isPrimary?: boolean; 
};

export default function useCreateCustomerAddress() {
  const queryClient = useQueryClient();

  const createAddressMutation = useMutation({
    mutationFn: async (payload: CreateCustomerAddressPayload) => {
      const { data } = await axiosInstance.post(
        "/api/address/create",
        payload,
      
      );
      return data; 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
      toast.success("Alamat berhasil ditambahkan");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message ?? "Gagal menambahkan alamat");
    },
  });

  return { createAddressMutation };
}
