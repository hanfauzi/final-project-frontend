"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarClock,
  ChevronLeft,
  Clock,
  Hash,
  Package,
  Store
} from "lucide-react";
import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "../_components/FormatDate";
import { StatusBadge } from "../_components/StatusBadge";
import useCancelOrder from "../_hooks/useCancelPickUpOrder";
import useGetCustomerOrderById from "../_hooks/useGetOrderById";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: order, isLoading, isError } =
    useGetCustomerOrderById(id);

  const { cancelOrderMutation } = useCancelOrder(); 

  const outletDisplay =
    order?.outlets?.name ??
    (order?.outletId ? `Outlet #${order.outletId}` : "-");

  const invoiceDisplay = order?.invoiceNo ?? `#${order?.id ?? ""}`;

  const canCancel = !!order && order.status === "WAITING_FOR_CONFIRMATION";

  return (
    <>
      <Head>
        <title>Detail Order — Laundr</title>
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
                Detail Order
              </div>
            </div>

          </div>
        </div>

        <main className="mx-auto w-full max-w-sm px-4 py-4 space-y-3">
          {isLoading && (
            <Card className="rounded-2xl border-neutral-200">
              <CardContent className="p-5 text-neutral-600">
                Memuat detail order…
              </CardContent>
            </Card>
          )}

          {isError && !isLoading && (
            <Card className="rounded-2xl border-neutral-200">
              <CardContent className="p-5 text-red-600">
                Gagal memuat detail order.
              </CardContent>
            </Card>
          )}

          {!isLoading && !isError && !order && (
            <Card className="rounded-2xl border-neutral-200">
              <CardContent className="p-5 text-neutral-600">
                Order tidak ditemukan.
              </CardContent>
            </Card>
          )}

          {!isLoading && !isError && order && (
            <>
              <Card className="rounded-2xl border-neutral-200">
                <CardContent className="p-4 space-y-4">
                  {/* Invoice */}
                  <div className="flex items-start gap-2">
                    <Hash className="h-4 w-4 text-neutral-500 mt-0.5" />
                    <div>
                      <div className="text-[12px] text-neutral-500">Invoice</div>
                      <div className="text-[13px] font-medium text-neutral-900">
                        {invoiceDisplay}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[12px] text-neutral-500">Status</div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-neutral-500 mt-0.5" />
                    <div>
                      <div className="text-[12px] text-neutral-500">Layanan</div>
                      <div className="text-[13px] font-medium text-neutral-900">
                        {order.notes || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CalendarClock className="h-4 w-4 text-neutral-500 mt-0.5" />
                    <div>
                      <div className="text-[12px] text-neutral-500">Dibuat</div>
                      <div className="text-[13px] text-neutral-900">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  {order.estHours !== null && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-neutral-500 mt-0.5" />
                      <div>
                        <div className="text-[12px] text-neutral-500">
                          Estimasi Selesai
                        </div>
                        <div className="text-[13px] text-neutral-900">
                          ± {order.estHours} jam
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <Store className="h-4 w-4 text-neutral-500 mt-0.5" />
                    <div>
                      <div className="text-[12px] text-neutral-500">Outlet</div>
                      <div className="text-[13px] text-neutral-900">
                        {outletDisplay}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {canCancel && (
                <div className="pt-2">
                  <Button
                    variant="destructive"
                    className="w-full h-11 rounded-xl"
                    disabled={cancelOrderMutation.isPending}
                    onClick={() => cancelOrderMutation.mutate(order.id)}
                  >
                    {cancelOrderMutation.isPending
                      ? "Membatalkan…"
                      : "Batalkan Order"}
                  </Button>
                </div>
              )}
            </>
          )}
        </main>

        <div className="h-6" />
      </div>
    </>
  );
}
