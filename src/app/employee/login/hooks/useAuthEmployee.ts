"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useAuthStore, type EmployeeStore } from "@/stores/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export default function useEmployeeLogin() {
  const onEmployeeAuthSuccess = useAuthStore((s) => s.onEmployeeAuthSuccess);
  const router = useRouter();

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
    onSuccess: (employee) => {
      onEmployeeAuthSuccess({ employee });
      toast.success("Login sucessful!");
      if (employee.role === "SUPER_ADMIN") {
        router.replace("/admin");
      } else if (employee.role === "OUTLET_ADMIN") {
        router.replace("/outlet-admin");
      } else {
        router.replace("/dashboard");
      }
    },
    onError: (err) => {
      toast.error(err.response?.data.message ?? "Login gagal");
    },
  });
}
