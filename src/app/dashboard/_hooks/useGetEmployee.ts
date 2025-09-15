"use client";

import { axiosInstance } from "@/lib/axios";
import { Employee } from "@/types/employee";
import { useEffect, useState, useCallback } from "react";

const useGetEmployee = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const raw = typeof window !== "undefined" ? localStorage.getItem("laundr-store") : null;
  const token = raw ? JSON.parse(raw).state?.employee?.token : null;

  const fetchEmployee = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/employee/get-employee", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmployee(response.data.data);
    } catch (err) {
      console.error("Failed to fetch employee:", err);
      setError("Failed to fetch employee");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return { employee, loading, error, refetch: fetchEmployee };
};

export default useGetEmployee;
