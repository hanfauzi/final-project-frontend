import { axiosInstance } from "@/lib/axios";
import { useAuthStore, CustomerStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

interface LoginPayload {
  email: string;
  password: string;
}

const useLoginHook = () => {
  const router = useRouter();
  const sp = useSearchParams();
  const next = useMemo(() => {
    const n = sp.get("next");
    return n && n.startsWith("/") ? n : null;
  }, [sp]);
  const { onCustomerAuthSuccess } = useAuthStore();

  const loginCustomerMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post<{
        payload: CustomerStore;
        token: string;
      }>("/api/auth/customer/login", payload, {
        skipAuth: true,
        skipRedirect401: true,
      });

      return {
        ...data.payload,
        token: data.token,
      };
    },
    onSuccess: (data: CustomerStore) => {
      onCustomerAuthSuccess({ customer: data });
      toast.success("Login berhasil");
      router.replace(next ?? "/");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Login gagal");
    },
  });

  return {
    loginCustomerMutation,
  };
};

export default useLoginHook;
