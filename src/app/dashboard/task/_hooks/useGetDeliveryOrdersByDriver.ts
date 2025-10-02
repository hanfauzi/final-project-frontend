"use client";

import { axiosInstance } from "@/lib/axios";
import { DeliveryOrder } from "@/types/deliveryOrder";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface GetPickUpOrdersQuery extends PaginationQueries {
  mode: "HISTORY" | "AVAILABLE_TASK";
  fromDate?: string;
  toDate?: string;
}

interface HookOptions {
  query?: GetPickUpOrdersQuery;
  activeInterval?: number | false;
  inactiveInterval?: number | false;
}

const useGetDeliveryOrdersByDriver = ({
  query,
  activeInterval = false,
  inactiveInterval = false,
}: HookOptions = {}) => {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

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

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return useQuery<PageableResponse<DeliveryOrder>, Error>({
    queryKey: ["delivery-order", query],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      const response = await axiosInstance.get(
        "/api/delivery-order/get-delivery-orders-by-driver",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: query ?? {},
        }
      );
      return response.data;
    },
    enabled: hydrated && !!token,
    refetchInterval: isVisible ? activeInterval : inactiveInterval,
  });
};

export default useGetDeliveryOrdersByDriver;
