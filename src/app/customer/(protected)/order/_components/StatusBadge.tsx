"use client";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

export function StatusBadge({ status }: { status: string }) {
  const { text, classes } = useMemo(() => {
    const WAIT  = "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400";  
    const PROG  = "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400";     
    const DONE  = "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"; 
    const FAIL  = "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400";          
    const FALL  = "bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300";         

    switch (status) {
      case "WAITING_FOR_CONFIRMATION":
      case "WAITING_FOR_DRIVER_PICKUP":
      case "WAITING_FOR_PAYMENT":
      case "READY_FOR_DELIVERY":
        return { text: mapText(status), classes: WAIT };

      case "ON_THE_WAY_TO_OUTLET":
      case "ARRIVED_AT_OUTLET":
      case "WASHING_IN_PROGRESS":
      case "IRONING_IN_PROGRESS":
      case "PACKING_IN_PROGRESS":
      case "OUT_FOR_DELIVERY":
        return { text: mapText(status), classes: PROG };

      case "DELIVERED_TO_CUSTOMER":
      case "COMPLETED":
        return { text: mapText(status), classes: DONE };

      case "CANCELLED":
        return { text: mapText(status), classes: FAIL };

      default:
        return { text: String(status), classes: FALL };
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
