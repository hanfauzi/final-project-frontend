"use client";

import { axiosInstance } from "@/lib/axios";
import { PickUpOrder } from "@/types/pickUpOrder";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useGetPickUpOrdersByDriver = () => {
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
    queryKey: ["pickup-order"],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      const response = await axiosInstance.get(
        "/api/pickup-order/get-pickup-orders-by-driver",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    },
    enabled: hydrated && !!token,
  });
};

export default useGetPickUpOrdersByDriver;
