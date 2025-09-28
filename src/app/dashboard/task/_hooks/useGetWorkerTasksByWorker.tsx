"use client";

import { axiosInstance } from "@/lib/axios";
import { PaginationQueries } from "@/types/pagination";
import { PickUpOrder } from "@/types/pickUpOrder";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface GetWorkerTasksQuery extends PaginationQueries {
  mode: "HISTORY" | "AVAILABLE_TASK";
}

const useGetWorkerTasksByWorker = (query?: GetWorkerTasksQuery) => {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("laundr-store");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setToken(parsed.state?.employee?.token ?? null);
      } catch (err) {
        console.error("Failed to parse token from storage", err);
        setToken(null);
      }
    }
    setHydrated(true);
  }, []);

  return useQuery<PickUpOrder[], Error>({
    queryKey: ["worker-task", query],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      const response = await axiosInstance.get(
        "/api/worker-task/get-worker-tasks-by-worker",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: query ?? {},
        }
      );
      return response.data.data;
    },
    enabled: hydrated && !!token,
  });
};

export default useGetWorkerTasksByWorker;
