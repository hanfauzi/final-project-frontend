import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export type PaymentStatus = "WAITING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELED";
export type PaymentMethod = "CASH" | "DEBIT" | "CREDIT" | "BANK_TRANSFER" | "QRIS" | "E_WALLET" | null;

export type PaymentRow = {
  id: string;
  orderHeaderId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  snapToken?: string | null;
  snapRedirectUrl?: string | null;
  providerRef?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  orderHeader?: {
    id: string;
    invoiceNo: string | null;
    status: string;
    outlets?: { id: string; name: string } | null;
    customers?: { id: string; name: string | null; email: string } | null;
  } | null;
};

export function useCreateOrReusePayment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { orderHeaderId: string }) => {
      const { data } = await axiosInstance.post<PaymentRow>("/api/payments/snap", payload);
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["payment", { orderHeaderId: data.orderHeaderId }] });

      if (data.snapRedirectUrl) {
        window.location.href = data.snapRedirectUrl;
      } else {
        toast.success("Snap token berhasil dibuat, tapi tidak ada URL redirect.");
      }
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message ?? "Gagal membuat pembayaran");
    },
  });
}




