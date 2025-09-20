import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

export function StatusBadge({ status }: { status: string }) {
  const { text, classes } = useMemo(() => {
    const BRAND = "bg-ring/10 text-ring";
    const POS   = "bg-accent text-primary";
    const NEG   = "bg-destructive/10 text-destructive";
    const NEU   = "bg-muted text-foreground";

    switch (status) {
      case "WAITING_FOR_CONFIRMATION":
      case "WAITING_FOR_PAYMENT":
      case "READY_FOR_DELIVERY":
        return { text: mapText(status), classes: BRAND };
      case "ACCEPTED":
      case "COMPLETED":
      case "DELIVERED_TO_CUSTOMER":
        return { text: mapText(status), classes: POS };
      case "REJECTED":
      case "CANCELLED":
        return { text: mapText(status), classes: NEG };
      case "PICKED_UP":
      case "IN_PROGRESS":
      case "READY":
      case "DELIVERING":
        return { text: mapText(status), classes: NEU };
      default:
        return { text: status, classes: "bg-muted text-muted-foreground" };
    }
  }, [status]);

  return <Badge className={`rounded-full px-2.5 py-0.5 ${classes}`}>{text}</Badge>;
}

function mapText(s: string) {
  switch (s) {
    case "WAITING_FOR_CONFIRMATION": return "Menunggu Konfirmasi";
    case "ACCEPTED": return "Diterima";
    case "REJECTED": return "Ditolak";
    case "PICKED_UP": return "Sudah Dijemput";
    case "IN_PROGRESS": return "Diproses";
    case "READY": return "Siap Diantar";
    case "DELIVERING": return "Diantar";
    case "COMPLETED": return "Selesai";
    case "CANCELLED": return "Dibatalkan";
    case "WAITING_FOR_PAYMENT": return "Menunggu Pembayaran";
    case "READY_FOR_DELIVERY": return "Siap Diantar";
    case "DELIVERED_TO_CUSTOMER": return "Pesanan Telah Dikirim";
    default: return s;
  }
}
