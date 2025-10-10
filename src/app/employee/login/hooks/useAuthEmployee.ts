"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useAuthStore, type EmployeeStore } from "@/stores/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface LoginPayload {
  email: string;
  password: string;
}

interface payload {
  id: string;
  role: "SUPER_ADMIN" | "OUTLET_ADMIN";
  email: string;
  outletId?: string | null;
}

interface LoginResponse {
  message: string;
  data: {
    token: string;
    payload: payload;
  };
}

const STORAGE_LAST_EMPLOYEE_ID = "lastEmployeeId";
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

export default function useEmployeeLogin() {
  const onEmployeeAuthSuccess = useAuthStore((s) => s.onEmployeeAuthSuccess);
  const queryClient = useQueryClient();
  const router = useRouter();

  const sp = useSearchParams();
  
    const next = useMemo(() => {
      const n = sp.get("next");
      return n && n.startsWith("/") ? n : null;
    }, [sp]);

  return useMutation<
    EmployeeStore,
    AxiosError<{ message: string }>,
    LoginPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<LoginResponse>(
        "/api/auth/employee/login",
        payload,
        {
          skipAuth: true,
          skipRedirect401: true,
        }
      );

      const { token, payload: user } = data.data;

      return {
        token,
        ...user,
      };
    },
    onSuccess: async (employee) => {
      let destination = DEFAULT_AFTER_LOGIN;
      let isSameEmployee = false;
      try {
        const prevId = typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_LAST_EMPLOYEE_ID)
          : null;

        const isSameEmployee = prevId && prevId === employee.id;

        if (isSameEmployee && isSafeNext(next)) {
          destination = next!;
        } else {
          if (employee.role === "SUPER_ADMIN") {
            destination = "/admin";
          } else if (employee.role === "OUTLET_ADMIN") {
            destination = "/outlet-admin";
          } else {
            destination = "/dashboard";
          }
        }
      } catch {
        if (employee.role === "SUPER_ADMIN") {
          destination = "/admin";
        } else if (employee.role === "OUTLET_ADMIN") {
          destination = "/outlet-admin";
        } else {
          destination = "/dashboard";
        }
      }

      onEmployeeAuthSuccess({ employee });

      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_LAST_EMPLOYEE_ID, employee.id);
        }
      } catch { }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["employee"] }),
        queryClient.invalidateQueries({ queryKey: ["attendances"] }),
      ]);

      toast.success(isSameEmployee ? "Welcome back!" : "Login successful!");

      router.replace(destination);
    },
    onError: (err) => {
      toast.error(err.response?.data.message ?? "Login gagal");
    },
  });
}
