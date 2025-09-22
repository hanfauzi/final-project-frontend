"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, ChevronLeft, Clock, CreditCard, Hash, Package, Store } from "lucide-react";
import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import { useCreateOrReusePayment } from "../../payment/_hooks/useCreateOrReusePayment";
import { formatDate } from "../_components/FormatDate";
import { StatusBadge } from "../_components/StatusBadge";
import useGetCustomerOrderById from "../_hooks/useGetOrderById";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: order, isLoading, isError } = useGetCustomerOrderById(id);
  const { mutate: createSnap, isPending: creatingSnap } = useCreateOrReusePayment();

  const outletDisplay = order?.outlets?.name ?? (order?.outletId ? `Outlet #${order.outletId}` : "-");
  const invoiceDisplay = order?.invoiceNo ?? `#${order?.id ?? ""}`;

  const canPay = !!order && order.status === "WAITING_FOR_PAYMENT";

  return (
    <>
      <Head><title>Detail Order — Laundr</title></Head>

      <div className="relative min-h-screen bg-transparent"> 
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur md:hidden"> 
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="ml-1.5 text-[15px] font-semibold text-foreground">Detail Order</div>
          </div>
        </div>

        <div className="hidden md:block"> 
          <div className="mx-auto w-full md:max-w-5xl md:px-6 md:pt-6">
            <h1 className="text-xl font-semibold text-foreground">Detail Order</h1>
          </div>
        </div>

        <main className="mx-auto w-full max-w-sm px-4 py-4 space-y-3 md:max-w-5xl md:px-6 md:py-8"> 
          {isLoading && (
            <Card className="rounded-2xl border border-border bg-card">
              <CardContent className="p-5 text-muted-foreground">
                Memuat detail order…
              </CardContent>
            </Card>
          )}

          {isError && !isLoading && (
            <Card className="rounded-2xl border border-border bg-card">
              <CardContent className="p-5 text-destructive">
                Gagal memuat detail order.
              </CardContent>
            </Card>
          )}

          {!isLoading && !isError && !order && (
            <Card className="rounded-2xl border border-border bg-card">
              <CardContent className="p-5 text-muted-foreground">
                Order tidak ditemukan.
              </CardContent>
            </Card>
          )}

          {!isLoading && !isError && order && (
            <>
              <Card className="rounded-2xl border border-border bg-card text-card-foreground">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Invoice</div>
                      <div className="text-[13px] font-medium text-foreground">{invoiceDisplay}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[12px] text-muted-foreground">Status</div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Layanan</div>
                      <div className="text-[13px] font-medium text-foreground">{order.serviceLabel}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Dibuat</div>
                      <div className="text-[13px] text-foreground">{formatDate(order.createdAt)}</div>
                    </div>
                  </div>

                  {order.estHours !== null && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-[12px] text-muted-foreground">Estimasi Selesai</div>
                        <div className="text-[13px] text-foreground">± {order.estHours} jam</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <Store className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Outlet</div>
                      <div className="text-[13px] text-foreground">{outletDisplay}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {canPay && (
                <Card className="rounded-2xl border border-border bg-card">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div className="text-[13px] font-medium text-foreground">Pembayaran</div>
                    </div>
                    <p className="text-[12px] text-muted-foreground">
                      Silakan lanjutkan pembayaran untuk memproses pengantaran.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        className="w-full h-11 rounded-xl"
                        disabled={creatingSnap}
                        onClick={() => { if (!id) return; createSnap({ orderHeaderId: id }); }}
                      >
                        {creatingSnap ? "Memproses" : "Bayar sekarang"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}


            </>
          )}
        </main>

        <div className="h-6" />
      </div>
    </>
  );
}
