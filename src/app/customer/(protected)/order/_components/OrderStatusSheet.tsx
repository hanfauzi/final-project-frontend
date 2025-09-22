"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const STATUSES = [
  { v: "", l: "Semua Status" },
  { v: "WAITING_FOR_CONFIRMATION", l: "Menunggu Konfirmasi" },
  { v: "WAITING_FOR_DRIVER_PICKUP", l: "Menunggu Driver Pickup" },
  { v: "ON_THE_WAY_TO_OUTLET", l: "Kurir Menuju Outlet" },
  { v: "ARRIVED_AT_OUTLET", l: "Tiba di Outlet" },
  { v: "WASHING_IN_PROGRESS", l: "Pencucian Berlangsung" },
  { v: "IRONING_IN_PROGRESS", l: "Penyetrikaan Berlangsung" },
  { v: "PACKING_IN_PROGRESS", l: "Pengemasan Berlangsung" },
  { v: "WAITING_FOR_PAYMENT", l: "Menunggu Pembayaran" },
  { v: "READY_FOR_DELIVERY", l: "Siap Dikirim" },
  { v: "OUT_FOR_DELIVERY", l: "Sedang Dikirim" },
  { v: "DELIVERED_TO_CUSTOMER", l: "Tiba di Tujuan" },
  { v: "COMPLETED", l: "Selesai" },
  { v: "CANCELLED", l: "Dibatalkan" },
];

export function OrderStatusSheet({
  value, onChange,
}: { value?: string; onChange: (v?: string) => void }) {
  const [open, setOpen] = useState(false);
  const current = STATUSES.find(s => s.v === (value ?? ""))?.l ?? "Semua Status";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-9 rounded-full px-3 text-[13px]">
          {current} <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] rounded-t-2xl">
        <SheetHeader><SheetTitle>Mau lihat status apa?</SheetTitle></SheetHeader>
        <div className="py-3 grid gap-1">
          {STATUSES.map(s => (
            <Button
              key={s.v}
              variant={s.v === (value ?? "") ? "default" : "ghost"}
              className="justify-start h-10"
              onClick={() => { onChange(s.v || undefined); setOpen(false); }}
            >
              {s.l}
            </Button>
          ))}
          {value && (
            <Button
              variant="ghost"
              className="justify-start h-10 text-destructive"
              onClick={() => { onChange(undefined); setOpen(false); }}
            >
              Hapus filter
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
