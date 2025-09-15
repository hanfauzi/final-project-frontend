"use client";

import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ClockOutPayload {
  latitude: number;
  longitude: number;
}

const useClockOutAttendance = () => {
  const queryClient = useQueryClient();
  const { employee } = useAuthStore();

  return useMutation({
    mutationFn: async ({ latitude, longitude }: ClockOutPayload) => {
      if (!employee?.token) {
        throw new Error("No token available");
      }

      await axiosInstance.patch(
        "/api/attendance/clock-out",
        { latitude, longitude },
        {
          headers: { Authorization: `Bearer ${employee.token}` },
        }
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["attendances"] });
      toast.success("Clock Out Successful ✅");
    },
    onError: (error: AxiosError<{ message: string; code: number }>) => {
      toast.error(error.response?.data.message ?? "Failed to clock out!");
    },
  });
};

export default useClockOutAttendance;
