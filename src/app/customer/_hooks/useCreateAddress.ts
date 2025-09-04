// src/app/customer/_hooks/useCreateAddress.ts
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type { LabelEnum } from "./useEditAddress"; // sudah ada di project-mu

export type CreateCustomerAddressPayload = {
  label: LabelEnum;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  notes?: string | null;
  isPrimary?: boolean; // optional, service-mu sudah handle unset primary lain
};

export default function useCreateCustomerAddress() {
  const { customer } = useAuthStore();
  const queryClient = useQueryClient();

  const createAddressMutation = useMutation({
    mutationFn: async (payload: CreateCustomerAddressPayload) => {
      const { data } = await axiosInstance.post(
        "/api/address/create",
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
      toast.success("Alamat berhasil ditambahkan.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message ?? "Gagal menambahkan alamat.");
    },
  });

  return { createAddressMutation };
}
