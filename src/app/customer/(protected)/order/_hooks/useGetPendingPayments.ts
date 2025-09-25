"use client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export type PendingPaymentNotif = {
  id: string;
  invoiceNo: string | null;
  createdAt: string;
  updatedAt: string;
  outletName: string | null;
};

type Options = {
  take?: number;
  enabled?: boolean;
  refetchInterval?: number;
} & Pick<UseQueryOptions<PendingPaymentNotif[], Error>, "staleTime">;

export default function usePendingPaymentNotifications(opts: Options = {}) {
  const { take = 5, enabled = true, refetchInterval = 30_000, staleTime = 15_000 } = opts;

  return useQuery<PendingPaymentNotif[], Error>({
    queryKey: ["pending-payment", { take }],
    enabled,
    refetchInterval,
    refetchOnWindowFocus: true,
    staleTime,
    queryFn: async () => {
      const res = await axiosInstance.get<PendingPaymentNotif[]>(
        "/api/order/pending-payments",
        { params: { take } }
      );
      return Array.isArray(res.data) ? res.data : [];
    },
  });
}
