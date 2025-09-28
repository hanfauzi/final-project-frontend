"use client";

import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ReqWorkerTaskBypassPayload {
  workerTaskId: string;
  bypassReqNote: string;
}

const useReqWorkerTaskBypass = () => {
  const queryClient = useQueryClient();
  const { employee } = useAuthStore();

  return useMutation({
    mutationFn: async ({ workerTaskId, bypassReqNote }: ReqWorkerTaskBypassPayload) => {
      if (!employee?.token) {
        throw new Error("No token available");
      }

      await axiosInstance.patch(
        `/api/worker-task/${workerTaskId}/request-bypass`,
        { bypassReqNote },
        {
          headers: { Authorization: `Bearer ${employee.token}` },
        }
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["worker-task"] });
      toast.success("Bypass request submitted successfully!");
    },
    onError: (error: AxiosError<{ message: string; code: number }>) => {
      toast.error(error.response?.data.message ?? "Failed to request bypass!");
    },
  });
};

export default useReqWorkerTaskBypass;
