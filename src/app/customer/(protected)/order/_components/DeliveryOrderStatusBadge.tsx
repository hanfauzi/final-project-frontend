"use client";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

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
    const WAIT  = "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400";
    const PROG  = "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400";
    const DONE  = "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
    const FALL  = "bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300";

    switch (status) {
      case "NOT_READY_TO_DELIVER":
      case "WAITING_FOR_DRIVER":
        return { text: mapDeliveryText(status), classes: WAIT };

      case "ON_THE_WAY_TO_OUTLET":
      case "ON_THE_WAY_TO_CUSTOMER":
        return { text: mapDeliveryText(status), classes: PROG };

      case "RECEIVED_BY_CUSTOMER":
      case "COMPLETED":
        return { text: mapDeliveryText(status), classes: DONE };

      default:
        return { text: String(status), classes: FALL };
    }
  }, [status]);

  return <Badge className={`rounded-full px-2.5 py-0.5 ${classes}`}>{text}</Badge>;
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
