"use client";

import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { WorkerTask } from "@/types/workerTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ValidateWorkerReCountItem {
  laundryItemId: string;
  qty: number;
}

interface ValidateWorkerReCountPayload {
  workerTaskId: string;
  items: ValidateWorkerReCountItem[];
}

interface ValidateWorkerReCountResponse {
  message: string;
  mismatches: {
    laundryItemId: string;
    itemName: string;
    expectedQty: number;
    receivedQty: number;
  }[];
  updatedWorkerTask: WorkerTask;
}

const useValidateWorkerReCount = () => {
  const queryClient = useQueryClient();
  const { employee } = useAuthStore();

  return useMutation<
    ValidateWorkerReCountResponse,
    AxiosError<{ message: string; code?: number }>,
    ValidateWorkerReCountPayload
  >({
    mutationFn: async (payload: ValidateWorkerReCountPayload) => {
      if (!employee?.token) {
        throw new Error("No token available");
      }

      const { data } = await axiosInstance.post(
        "/api/worker-task/validate-worker-recount",
        payload,
        {
          headers: { Authorization: `Bearer ${employee.token}` },
        }
      );

      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["worker-task", data.updatedWorkerTask.id] });
      if (data.mismatches.length > 0) {
        toast.warning("Validation failed — mismatches found ⚠️");
      } else {
        toast.success("Validation success!");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to clock in!");
    },
  });
};

export default useValidateWorkerReCount;
