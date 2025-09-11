import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

export function StatusBadge({ status }: { status: string }) {
  const { text, classes } = useMemo(() => {
    switch (status) {
      case "WAITING_FOR_CONFIRMATION":
        return {
          text: "Menunggu Konfirmasi",
          classes: "bg-amber-100 text-amber-800",
        };
      case "ACCEPTED":
        return { text: "Diterima", classes: "bg-emerald-100 text-emerald-800" };
      case "REJECTED":
        return { text: "Ditolak", classes: "bg-red-100 text-red-800" };
      case "PICKED_UP":
        return { text: "Sudah Dijemput", classes: "bg-blue-100 text-blue-800" };
      case "IN_PROGRESS":
        return { text: "Diproses", classes: "bg-sky-100 text-sky-800" };
      case "READY":
        return {
          text: "Siap Diantar",
          classes: "bg-violet-100 text-violet-800",
        };
      case "DELIVERING":
        return { text: "Diantar", classes: "bg-indigo-100 text-indigo-800" };
      case "COMPLETED":
        return { text: "Selesai", classes: "bg-emerald-100 text-emerald-800" };
      case "CANCELLED":
        return {
          text: "Dibatalkan",
          classes: "bg-neutral-200 text-neutral-700",
        };
      default:
        return { text: status, classes: "bg-neutral-200 text-neutral-700" };
    }
  }, [status]);

  return (
    <Badge className={`rounded-full px-2.5 py-0.5 ${classes}`}>{text}</Badge>
  );
}