"use client";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { CustomerStore, useAuthStore } from "@/stores/auth";

type GoogleLoginResp = {
  success: boolean;
  token: string;
  customer: {
    id: string;
    email: string;
    role: string;
    name?: string;
    phoneNumber?: string;
  };
};

export function useGoogleLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (idToken: string) => {
      const { data } = await axiosInstance.post<GoogleLoginResp>(
        "/api/auth/customer/google",
        { idToken }
      );
      return data;
    },
onSuccess: ({ token, customer }) => {
  const normalized: CustomerStore = {
    id: customer.id,
    email: customer.email,
    role: "CUSTOMER",               
    name: customer.name ?? "",      
    phoneNumber: customer.phoneNumber ?? "",
    token,
  };

  useAuthStore.getState().onCustomerAuthSuccess({ customer: normalized });
  toast.success("Berhasil masuk dengan Google.");
  router.replace("/");
},
    onError: (e: AxiosError<{ message?: string }>) => {
      toast.error(e.response?.data?.message ?? "Login Google gagal");
    },
  });
}
