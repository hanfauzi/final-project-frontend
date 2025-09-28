import { axiosInstance } from "@/lib/axios";
import { WorkerTask } from "@/types/workerTasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useBypassRequest(outletId?: string) {
  return useQuery({
    queryKey: [`bypass-request`, outletId],
    queryFn: async () => {
      const res = await axiosInstance.get<{data: WorkerTask[]; message: string}>(
        `/api/admin/bypass-requests`
      );
      return res.data.data;
    },
  });
}

export function useAcceptBypassRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      adminId,
      note,
    }: {
      taskId: string;
      adminId: string;
      note?: string;
    }) => {
      const res = await axiosInstance.patch(
        `/api/admin/bypass-requests/${taskId}/review`,
        {
          adminId,
          approve: true,
          note,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bypass-request"] });
      toast.success("Bypass request accepted");
    },
  });
}

export function useRejectBypassRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      adminId,
      note,
    }: {
      taskId: string;
      adminId: string;
      note: string;
    }) => {
      const res = await axiosInstance.patch(
        `/api/admin/bypass-requests/${taskId}/review`,
        {
          adminId,
          approve: false,
          note,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bypass-request"] });
      toast.success("Bypass request rejection has been sent!")
    },
    onError: () => {
        toast.error("Failed to reject bypass request");
    }
  });
}
