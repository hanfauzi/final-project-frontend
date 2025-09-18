"use client";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/navigation";
import useGetCustomerOrders from "./_hooks/useGetOrders";
import { useDebounce } from "./_hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "./_components/StatusBadge";
import { formatDate } from "./_components/FormatDate";
import { DateSheet } from "./_components/DateSheet";
import {
  ChevronLeft, ChevronRight, Hash, Package,
  CalendarClock, Plus, RefreshCw, X
} from "lucide-react";
import { StatusSheet } from "./_components/StatusSheet";

export default function CustomerOrdersPage() {
  const router = useRouter();

  // state ketikan user (selalu tersimpan di UI)
  const [page, setPage] = useState(1);
  const [invoiceNo, setInvoiceNo] = useState("");       // <- user typing di sini
  const [status, setStatus] = useState<string | undefined>();
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();

  // kirim ke server pakai nilai yang SUDAH didebounce (500ms)
  const debouncedInvoice = useDebounce(invoiceNo, 500);

  const { data, isLoading, isError, isFetching } = useGetCustomerOrders({
    page,
    take: 5,
    status,
    invoiceNo: debouncedInvoice || undefined, // <- ini yang dipakai query
    dateFrom,
    dateTo,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <Head><title>Order Saya — Laundr</title></Head>

      <div className="relative min-h-screen bg-neutral-50">
        {/* topbar */}
        <div className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-[15px] font-semibold">Order Saya</div>
            </div>
            <Link href="/customer/order/create" className="inline-flex items-center gap-1.5 text-neutral-900">
              <Plus className="h-4 w-4" /><span className="text-sm font-medium">Create Order</span>
            </Link>
          </div>
        </div>

        {/* search + chips */}
        <div className="mx-auto w-full max-w-sm px-4 py-3 space-y-2">
          <div className="relative">
            <Input
              placeholder="Cari Invoice / Order ID…"
              value={invoiceNo}                              // <- simpan ketikan user
              onChange={(e) => { setInvoiceNo(e.target.value); setPage(1); }}
              className="h-10 rounded-xl text-[13px] pr-20"
            />
            {/* clear + indikator fetching kecil */}
            <div className="absolute inset-y-0 right-2 flex items-center gap-2">
              {isFetching && !isLoading && (
                <RefreshCw className="h-4 w-4 animate-spin text-neutral-500" />
              )}
              {invoiceNo && (
                <Button variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => { setInvoiceNo(""); setPage(1); }}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <StatusSheet value={status} onChange={(v) => { setStatus(v); setPage(1); }} />
            <DateSheet
              from={dateFrom}
              to={dateTo}
              onApply={(f, t) => { setDateFrom(f); setDateTo(t); setPage(1); }}
              onClear={() => { setDateFrom(undefined); setDateTo(undefined); setPage(1); }}
            />
          </div>
        </div>

        {/* list */}
        <main className="mx-auto w-full max-w-sm px-4 pb-6 space-y-3">
          {isLoading && (
            <div className="py-10 grid place-items-center text-neutral-600">
              <RefreshCw className="h-5 w-5 animate-spin mb-2" />
              Memuat order…
            </div>
          )}

          {isError && !isLoading && (
            <div className="py-10 text-center text-red-600">Gagal memuat order.</div>
          )}

          {!isLoading && !isError && orders.length === 0 && (
            <div className="py-10 text-center text-neutral-600">Belum ada order.</div>
          )}

          {orders.map((o) => {
            const inv = o.invoiceNo ?? `#${o.id.slice(0, 6).toUpperCase()}`;
            return (
              <Link key={o.id} href={`/customer/order/${o.id}`} className="block">
                <Card className="rounded-xl border-neutral-200 hover:bg-white">
                  <CardContent className="p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[12px] text-neutral-600">
                          <Hash className="h-3.5 w-3.5 text-neutral-500" />
                          <span className="font-medium text-neutral-800">{inv}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-neutral-500" />
                          <div className="text-[13px] font-medium">{o.notes || "Tanpa catatan"}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CalendarClock className="h-4 w-4 text-neutral-500" />
                          <div className="text-[12px] text-neutral-600">{formatDate(o.createdAt)}</div>
                        </div>
                        <StatusBadge status={o.status} />
                      </div>
                      <ChevronRight className="h-5 w-5 text-neutral-400 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="outline" size="sm" className="rounded-full"
                disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <span className="text-sm text-neutral-600">
                {meta.page} / {meta.totalPages}
              </span>
              <Button
                variant="outline" size="sm" className="rounded-full"
                disabled={page >= meta.totalPages} onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
