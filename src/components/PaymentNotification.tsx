"use client";
import usePendingPaymentNotifications from "@/app/customer/(protected)/order/_hooks/useGetPendingPayments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import React from "react";

function timeAgoISO(iso: string) {
  const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" });
  const now = Date.now();
  const then = new Date(iso).getTime();
  let diff = Math.round((then - now) / 1000)

  const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],       
    [60, "minute"],       
    [24, "hour"],         
    [7, "day"],          
    [4.34524, "week"],    
    [12, "month"],        
    [Number.POSITIVE_INFINITY, "year"],
  ];

  for (const [amount, unit] of divisions) {
    if (Math.abs(diff) < amount) {
      return rtf.format(diff, unit);
    }
    diff = Math.round(diff / amount);
  }
  return rtf.format(diff, "year");
}

function useNow(tickMs = 30_000) {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);
}


export function BellNotifications({ loggedIn }: { loggedIn: boolean }) {
   useNow(30_000);
  const { data = [], isLoading, isError } = usePendingPaymentNotifications({
    take: 5,
    enabled: loggedIn,
    refetchInterval: 30_000,
  });

  const count = data.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label="Notifikasi pembayaran"
        >
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span
              className={clsx(
                "absolute -top-1 -right-1 min-w-[18px] h-[18px]",
                "rounded-full bg-destructive text-[11px] leading-[18px]",
                "text-white text-center px-1"
              )}
            >
              {count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 rounded-none p-0 border shadow-md text-left"
      >
        <div className="px-3 py-2">
          <DropdownMenuLabel className="p-0 text-[13px] font-medium text-left">
            {isLoading ? "Memuat notifikasi…" : "Menunggu Pembayaran"}
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />

        {isError && (
          <div className="px-3 py-3 text-sm text-destructive">
            Gagal memuat notifikasi.
          </div>
        )}

        {!isLoading && !isError && count === 0 && (
          <div className="px-3 py-3 text-sm text-muted-foreground">
            Tidak ada tagihan yang menunggu.
          </div>
        )}

         {!isLoading && !isError && count > 0 && (
    <ul className="py-0">
      {data.map((n) => {
        const inv = n.invoiceNo ?? `#${n.id.slice(0, 6).toUpperCase()}`;
        const since = timeAgoISO(n.updatedAt); 
        const exact = new Date(n.updatedAt).toLocaleString("id-ID");

        return (
          <li key={n.id} className="border-b last:border-b-0">
            <DropdownMenuItem asChild className="px-3 py-2.5">
              <Link href={`/customer/order/${n.id}`} className="flex w-full flex-col items-start text-left">
                <span className="text-[13px] font-semibold text-foreground">
                  {inv}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  Pesanan selesai dan menunggu pembayaran
                </span>
                <span className="text-[11px] text-muted-foreground" title={exact}>
                  {since}
                </span>
              </Link>
            </DropdownMenuItem>
          </li>
        );
      })}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
