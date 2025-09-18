import { useMutation } from "@tanstack/react-query";
import { authAdminService, LoginDto, AuthResponse } from "../services/auth-admin.service";
import { useAuthStore } from "@/stores/auth";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

// Super Admin
export function useSuperAdminLogin() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = useMemo(() => {
    const n = sp.get("next");
    return n && n.startsWith("/") ? n : null;
  }, [sp]);

  const { onEmployeeAuthSuccess } = useAuthStore();

  return useMutation<AuthResponse, AxiosError<{ message: string }>, LoginDto>({
    mutationFn: authAdminService.superAdminLogin,
    onSuccess: (data) => {
      onEmployeeAuthSuccess({ employee: { ...data.payload, token: data.token } });
      toast.success("Login berhasil");
      router.replace(next ?? "/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Login gagal");
    },
  });
}

// Outlet Admin
export function useOutletAdminLogin() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = useMemo(() => {
    const n = sp.get("next");
    return n && n.startsWith("/") ? n : null;
  }, [sp]);

  const { onEmployeeAuthSuccess } = useAuthStore();

  return useMutation<AuthResponse, AxiosError<{ message: string }>, LoginDto>({
    mutationFn: authAdminService.outletAdminLogin,
    onSuccess: (data) => {
      onEmployeeAuthSuccess({ employee: { ...data.payload, token: data.token } });
      toast.success("Login berhasil");
      router.replace(next ?? "/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Login gagal");
    },
  });
}
