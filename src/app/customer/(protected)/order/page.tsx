"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerOrder } from "@/types/customerOrders";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Hash,
  Package,
  Plus,
  RefreshCw,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "./_components/FormatDate";
import { StatusBadge } from "./_components/StatusBadge";
import useGetCustomerOrders from "./_hooks/useGetOrders";

export default function CustomerOrdersPage() {
  const {
    data: orders,
    isLoading,
    isError,
  } = useGetCustomerOrders();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Order Saya — Laundr</title>
      </Head>

      <div className="relative min-h-screen bg-neutral-50">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />
        <div className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-[15px] font-semibold text-neutral-900">
                Order Saya
              </div>
            </div>
            <Link
              href="/customer/order/create"
              className="inline-flex items-center gap-1.5 text-neutral-900"
            >
              <Plus className="h-4 w-4 cursor-pointer" />
              <span className="text-sm font-medium">Create Order</span>
            </Link>
          </div>
        </div>

        <main className="mx-auto w-full max-w-sm px-4 py-4 space-y-3">
          {isLoading && (
            <div className="py-10 grid place-items-center text-neutral-600">
              <RefreshCw className="h-5 w-5 animate-spin mb-2" />
              Memuat order…
            </div>
          )}

          {isError && !isLoading && (
            <div className="py-10 text-center text-red-600">
              Gagal memuat order.
            </div>
          )}

          {!isLoading && !isError && (orders?.length ?? 0) === 0 && (
            <div className="py-10 text-center text-neutral-600">
              Belum ada order.
            </div>
          )}

          {!isLoading &&
            !isError &&
            (orders ?? []).map((o: CustomerOrder) => {
              const inv = o.invoiceNo ?? `#${o.id.slice(0, 6).toUpperCase()}`;
              return (
                <Link
                  key={o.id}
                  href={`/customer/order/${o.id}`}
                  className="block focus:outline-none focus:ring-2 focus:ring-neutral-900/20 rounded-2xl"
                >
                  <Card className="rounded-2xl border-neutral-200 hover:bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[12px] text-neutral-600">
                            <Hash className="h-3.5 w-3.5 text-neutral-500" />
                            <span className="font-medium text-neutral-800">
                              {inv}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-neutral-500" />
                            <div className="text-[13px] font-medium text-neutral-900">
                              {o.notes || "Tanpa catatan"}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-neutral-500" />
                            <div className="text-[12px] text-neutral-600">
                              {formatDate(o.createdAt)}
                            </div>
                          </div>

                          <div className="pt-1">
                            <StatusBadge status={o.status} />
                          </div>
                        </div>

                        <ChevronRight className="h-5 w-5 text-neutral-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
        </main>
      </div>
    </>
  );
}
