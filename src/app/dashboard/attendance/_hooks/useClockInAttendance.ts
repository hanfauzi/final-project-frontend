"use client";

import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ClockInPayload {
  latitude: number;
  longitude: number;
}

const useClockInAttendance = () => {
  const queryClient = useQueryClient();
  const { employee } = useAuthStore();

  return useMutation({
    mutationFn: async ({ latitude, longitude }: ClockInPayload) => {
      if (!employee?.token) {
        throw new Error("No token available");
      }

      await axiosInstance.post(
        "/api/attendance/clock-in",
        { latitude, longitude },
        {
          headers: { Authorization: `Bearer ${employee.token}` },
        }
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["attendances"] });
      toast.success("Clock In Successful ✅");
    },
    onError: (error: AxiosError<{ message: string; code: number }>) => {
      toast.error(error.response?.data.message ?? "Failed to clock in!");
    },
  });
};

export default useClockInAttendance;
