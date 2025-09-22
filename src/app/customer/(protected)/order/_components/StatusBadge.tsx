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
      case "WAITING_FOR_DRIVER_PICKUP":
      case "WAITING_FOR_PAYMENT":
      case "READY_FOR_DELIVERY":
        return { text: mapText(status), classes: BRAND };

      case "ON_THE_WAY_TO_OUTLET":
      case "ARRIVED_AT_OUTLET":
      case "WASHING_IN_PROGRESS":
      case "IRONING_IN_PROGRESS":
      case "PACKING_IN_PROGRESS":
      case "OUT_FOR_DELIVERY":
        return { text: mapText(status), classes: NEU };

      case "DELIVERED_TO_CUSTOMER":
      case "COMPLETED":
        return { text: mapText(status), classes: POS };

      case "CANCELLED":
        return { text: mapText(status), classes: NEG };

      default:
        return { text: String(status), classes: "bg-muted text-muted-foreground" };
    }
  }, [status]);

  return <Badge className={`rounded-full px-2.5 py-0.5 ${classes}`}>{text}</Badge>;
}

function mapText(s: string) {
 switch (s) {
    case "WAITING_FOR_CONFIRMATION":  return "Menunggu Konfirmasi";
    case "WAITING_FOR_DRIVER_PICKUP": return "Menunggu Driver Pickup";
    case "ON_THE_WAY_TO_OUTLET":      return "Kurir Menuju Outlet";
    case "ARRIVED_AT_OUTLET":         return "Tiba di Outlet";
    case "WASHING_IN_PROGRESS":       return "Pencucian Berlangsung";
    case "IRONING_IN_PROGRESS":       return "Penyetrikaan Berlangsung";
    case "PACKING_IN_PROGRESS":       return "Pengemasan Berlangsung";
    case "WAITING_FOR_PAYMENT":       return "Menunggu Pembayaran";
    case "READY_FOR_DELIVERY":        return "Siap Dikirim";
    case "OUT_FOR_DELIVERY":          return "Sedang Dikirim";
    case "DELIVERED_TO_CUSTOMER":     return "Tiba di Tujuan";
    case "COMPLETED":                 return "Selesai";
    case "CANCELLED":                 return "Dibatalkan";
    default:                          return String(s);
  }
}
