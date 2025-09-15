"use client";

import { axiosInstance } from "@/lib/axios";
import { Attendance } from "@/types/attendance";
import { PaginationQueries } from "@/types/pagination";
import { useEffect, useState, useCallback } from "react";

interface GetAttendanceQuery extends PaginationQueries {
  yearMonth?: string;
}

const useGetAttendanceByEmployee = (query?: GetAttendanceQuery) => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const raw = typeof window !== "undefined" ? localStorage.getItem("laundr-store") : null;
  const token = raw ? JSON.parse(raw).state?.employee?.token : null;

  const fetchAttendances = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/attendance/get-attendance-by-employee", {
        headers: { Authorization: `Bearer ${token}` },
        params: query ?? {},
      });
      
      setAttendances(response.data.data);
    } catch (err) {
      console.error("Failed to fetch attendances:", err);
      setError("Failed to fetch attendances");
    } finally {
      setLoading(false);
    }
  }, [token, query])

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  return { attendances, loading, error, refetch: fetchAttendances };
}

export default useGetAttendanceByEmployee;