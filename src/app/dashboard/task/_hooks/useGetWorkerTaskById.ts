import { axiosInstance } from "@/lib/axios";
import { WorkerTask } from "@/types/workerTask";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const useGetWorkerTaskById = (
  id: string,
  options?: Omit<UseQueryOptions<WorkerTask>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<WorkerTask>({
    queryKey: ["worker-task", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/worker-task/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    ...options,
  });
};

export default useGetWorkerTaskById;
