"use client";

import { axiosInstance } from "@/lib/axios";
import { Attendance } from "@/types/attendance";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface GetAttendanceQuery extends PaginationQueries {
  yearMonth?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

const useGetAttendanceByAdmin = (query?: GetAttendanceQuery) => {
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

  return useQuery<PageableResponse<Attendance>, Error>({
    queryKey: ["attendances", query],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      const response = await axiosInstance.get(
        "/api/attendance/get-attendance-by-admin",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: query ?? {},
        }
      );
      return response.data;
    },
    enabled: hydrated && !!token,
  });
};

export default useGetAttendanceByAdmin;
