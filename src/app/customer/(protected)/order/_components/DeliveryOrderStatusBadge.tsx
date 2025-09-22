"use client";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

/** Safe type untuk status delivery */
export type DeliveryOrderStatus =
  | "NOT_READY_TO_DELIVER"
  | "WAITING_FOR_DRIVER"
  | "ON_THE_WAY_TO_OUTLET"
  | "ON_THE_WAY_TO_CUSTOMER"
  | "RECEIVED_BY_CUSTOMER"
  | "COMPLETED"
  | string;

export function DeliveryStatusBadge({ status }: { status: DeliveryOrderStatus }) {
  const { text, classes } = useMemo(() => {
    const BRAND = "bg-ring/10 text-ring";                  // call-to-action / menunggu
    const POS   = "bg-accent text-primary";                // sukses / selesai
    const NEU   = "bg-muted text-foreground";              // proses / in transit

    switch (status) {
      case "NOT_READY_TO_DELIVER":
      case "WAITING_FOR_DRIVER":
        return { text: mapDeliveryText(status), classes: BRAND };

      case "ON_THE_WAY_TO_OUTLET":
      case "ON_THE_WAY_TO_CUSTOMER":
        return { text: mapDeliveryText(status), classes: NEU };

      case "RECEIVED_BY_CUSTOMER":
      case "COMPLETED":
        return { text: mapDeliveryText(status), classes: POS };

      default:
        return { text: String(status), classes: "bg-muted text-muted-foreground" };
    }
  }, [status]);

  return (
    <Badge className={`rounded-full px-2.5 py-0.5 ${classes}`}>
      {text}
    </Badge>
  );
}

function mapDeliveryText(s: DeliveryOrderStatus) {
  switch (s) {
    case "NOT_READY_TO_DELIVER":   return "Belum Siap Dikirim";
    case "WAITING_FOR_DRIVER":     return "Menunggu Driver";
    case "ON_THE_WAY_TO_OUTLET":   return "Driver Menuju Outlet";
    case "ON_THE_WAY_TO_CUSTOMER": return "Driver Menuju Customer";
    case "RECEIVED_BY_CUSTOMER":   return "Diterima Customer";
    case "COMPLETED":              return "Selesai";
    default: return String(s);
  }
}
