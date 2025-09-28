"use client";

import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useProcessWorkerTask = () => {
  const queryClient = useQueryClient();
  const { employee } = useAuthStore();

  return useMutation({
    mutationFn: async (workerTaskId: string) => {
      if (!employee?.token) {
        throw new Error("No token available");
      }

      await axiosInstance.patch(
        `/api/worker-task/${workerTaskId}/process-worker-task`,
        {},
        {
          headers: { Authorization: `Bearer ${employee.token}` },
        }
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["worker-task"] });
      toast.success("Worker task processed successfully!");
    },
    onError: (error: AxiosError<{ message: string; code: number }>) => {
      toast.error(error.response?.data.message ?? "Failed to process worker task!");
    },
  });
};

export default useProcessWorkerTask;
