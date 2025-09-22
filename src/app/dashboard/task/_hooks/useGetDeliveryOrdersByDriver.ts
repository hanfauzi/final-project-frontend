"use client";

import { axiosInstance } from "@/lib/axios";
import { DeliveryOrder } from "@/types/deliveryOrder";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useGetDeliveryOrdersByDriver = () => {
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

  return useQuery<DeliveryOrder[], Error>({
    queryKey: ["delivery-order"],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      const response = await axiosInstance.get(
        "/api/delivery-order/get-delivery-orders-by-driver",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    },
    enabled: hydrated && !!token,
  });
};

export default useGetDeliveryOrdersByDriver;
