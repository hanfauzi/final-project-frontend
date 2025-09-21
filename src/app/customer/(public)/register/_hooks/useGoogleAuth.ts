"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

type GoogleResp = {
  success: boolean;
  mode: "LOGIN" | "REGISTER";
  token?: string;
  setPasswordEmailSent?: boolean;
  message?: string;
};

export function useGoogleAuth() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (idToken: string) => {
      const { data } = await axiosInstance.post<GoogleResp>(
        "/api/auth/customer/google",
        { idToken }  
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.mode === "LOGIN") {
        toast.success("Masuk dengan Google berhasil!");
        router.replace("/"); 
      } else {
        toast.success("Pendaftaran dengan Google berhasil! Silakan cek email dan atur kata sandi Anda.");
        router.replace("/customer/login");
      }
    },
       onError: (error: AxiosError<{ message: string }>) => {
         toast.error(error.response?.data.message ?? "Registrasi/Masuk gagal");
       },
  });
}
