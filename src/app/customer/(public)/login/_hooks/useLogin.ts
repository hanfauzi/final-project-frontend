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

const STORAGE_LAST_CUSTOMER_ID = "lastCustomerId";
const DEFAULT_AFTER_LOGIN = "/"; 
function isSafeNext(next: string | null) {
  if (!next) return false;
  try {
    const u = new URL(next, window.location.origin);
    if (u.origin !== window.location.origin) return false;
    if (u.pathname.startsWith("/customer/login")) return false;
    if (u.pathname.startsWith("/employee/login")) return false;
    if (u.pathname.startsWith("/unauthorized")) return false;
    return true;
  } catch {
    return false;
  }
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
      let destination = DEFAULT_AFTER_LOGIN;

      try {
        const prevId = typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_LAST_CUSTOMER_ID)
          : null;

        const sameAccount = prevId && prevId === data.id;

        if (sameAccount && isSafeNext(next)) {
          destination = next!;
        }
      } catch {
        destination = DEFAULT_AFTER_LOGIN;
      }

      onCustomerAuthSuccess({ customer: data });
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_LAST_CUSTOMER_ID, data.id);
        }
      } catch { }

      toast.success("Login berhasil");
      router.replace(destination);
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
