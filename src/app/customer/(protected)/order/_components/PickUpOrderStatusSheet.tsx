"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type PickUpOrderStatus =
  | "WAITING_FOR_DRIVER"
  | "ON_THE_WAY_TO_CUSTOMER"
  | "ON_THE_WAY_TO_OUTLET"
  | "RECEIVED_BY_OUTLET"
  | "CANCELLED"
  | string;

const PICKUP_STATUSES: { v: PickUpOrderStatus | ""; l: string }[] = [
  { v: "", l: "Semua Status" },
  { v: "WAITING_FOR_DRIVER", l: "Menunggu Driver" },
  { v: "ON_THE_WAY_TO_CUSTOMER", l: "Driver Menuju Customer" },
  { v: "ON_THE_WAY_TO_OUTLET", l: "Driver Menuju Outlet" },
  { v: "RECEIVED_BY_OUTLET", l: "Diterima di Outlet" },
  { v: "CANCELLED", l: "Dibatalkan" },
];

export function PickUpStatusSheet({
  value,
  onChange,
}: {
  value?: PickUpOrderStatus;
  onChange: (v?: PickUpOrderStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const current =
    PICKUP_STATUSES.find((s) => s.v === (value ?? ""))?.l ?? "Semua Status";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-9 rounded-full px-3 text-[13px]">
          {current} <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="max-h-[80vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Mau lihat status pickup apa?</SheetTitle>
        </SheetHeader>

        <div className="py-3 grid gap-1">
          {PICKUP_STATUSES.map((s) => (
            <Button
              key={s.v}
              variant={s.v === (value ?? "") ? "default" : "ghost"}
              className="justify-start h-10"
              onClick={() => {
                onChange((s.v as PickUpOrderStatus) || undefined);
                setOpen(false);
              }}
            >
              {s.l}
            </Button>
          ))}

          {value && (
            <Button
              variant="ghost"
              className="justify-start h-10 text-destructive"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
            >
              Hapus filter
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
