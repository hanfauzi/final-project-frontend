"use client";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

export type PickUpOrderStatus =
  | "WAITING_FOR_DRIVER"
  | "ON_THE_WAY_TO_CUSTOMER"
  | "ON_THE_WAY_TO_OUTLET"
  | "RECEIVED_BY_OUTLET"
  | "CANCELLED"
  | string;

export function PickUpStatusBadge({ status }: { status: PickUpOrderStatus }) {
  const { text, classes } = useMemo(() => {
    const WAIT  = "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400";
    const PROG  = "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400";
    const DONE  = "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
    const FAIL  = "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400";
    const FALL  = "bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300";

    switch (status) {
      case "WAITING_FOR_DRIVER":
        return { text: mapPickUpText(status), classes: WAIT };

      case "ON_THE_WAY_TO_CUSTOMER":
      case "ON_THE_WAY_TO_OUTLET":
        return { text: mapPickUpText(status), classes: PROG };

      case "RECEIVED_BY_OUTLET":
        return { text: mapPickUpText(status), classes: DONE };

      case "CANCELLED":
        return { text: mapPickUpText(status), classes: FAIL };

      default:
        return { text: status, classes: FALL };
    }
  }, [status]);

  return <Badge className={`rounded-full px-2.5 py-0.5 ${classes}`}>{text}</Badge>;
}

function mapPickUpText(s: PickUpOrderStatus) {
  switch (s) {
    case "WAITING_FOR_DRIVER":     return "Menunggu Driver";
    case "ON_THE_WAY_TO_CUSTOMER": return "Driver Menuju Customer";
    case "ON_THE_WAY_TO_OUTLET":   return "Driver Menuju Outlet";
    case "RECEIVED_BY_OUTLET":     return "Diterima di Outlet";
    case "CANCELLED":              return "Dibatalkan";
    default: return String(s);
  }
}
