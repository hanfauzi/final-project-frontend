"use client";

import Head from "next/head";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarClock,
  ChevronLeft,
  Hash,
  Navigation,
  Phone,
  Store,
  Truck,
  MapPin,
  Receipt,
} from "lucide-react";
import { DeliveryStatusBadge } from "../../_components/DeliveryOrderStatusBadge";
import { formatDate } from "../../_components/FormatDate";
import useGetCustomerDeliveryOrderById from "../../_hooks/useGetCustomerDeliveryOrderById";
import useConfirmationOrder from "../../_hooks/useConfirmationOrder";

export default function DeliveryOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
const { confirmationOrderMutation } = useConfirmationOrder();
  const { data: delivery, isLoading, isError } = useGetCustomerDeliveryOrderById(id);

  const outletDisplay = delivery?.outlet?.name ?? "-";
  const outletCity = delivery?.outlet?.cityName ? ` • ${delivery.outlet.cityName}` : "";
  const outletAddr = delivery?.outlet?.address ?? "";
  const shortId = delivery?.id ? `#${delivery.id.slice(0, 6).toUpperCase()}` : "-";
  const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const canConfirm = delivery && delivery &&
  delivery.orderHeader?.status === "DELIVERED_TO_CUSTOMER";

  return (
    <>
      <Head><title>Detail Delivery — Laundr</title></Head>

      <div className="relative min-h-screen bg-transparent">
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur md:hidden">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="ml-1.5 text-[15px] font-semibold text-foreground">Detail Delivery</div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="mx-auto w-full md:max-w-5xl md:px-6 md:pt-6">
            <h1 className="text-xl font-semibold text-foreground">Detail Delivery</h1>
          </div>
        </div>

        <main className="mx-auto w-full max-w-sm px-4 py-4 space-y-3 md:max-w-5xl md:px-6 md:py-8">
          {isLoading && (
            <Card className="rounded-2xl border border-border bg-card">
              <CardContent className="p-5 text-muted-foreground">Memuat detail delivery…</CardContent>
            </Card>
          )}

          {isError && !isLoading && (
            <Card className="rounded-2xl border border-border bg-card">
              <CardContent className="p-5 text-destructive">Gagal memuat detail delivery.</CardContent>
            </Card>
          )}

          {!isLoading && !isError && !delivery && (
            <Card className="rounded-2xl border border-border bg-card">
              <CardContent className="p-5 text-muted-foreground">Delivery tidak ditemukan.</CardContent>
            </Card>
          )}

          {!isLoading && !isError && delivery && (
            <>
              <Card className="rounded-2xl border border-border bg-card text-card-foreground">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Delivery ID</div>
                      <div className="text-[13px] font-medium text-foreground">{shortId}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[12px] text-muted-foreground">Status</div>
                    <DeliveryStatusBadge status={delivery.status} />
                  </div>

                  <div className="flex items-start gap-2">
                    <Store className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Outlet</div>
                      <div className="text-[13px] font-medium text-foreground">
                        {outletDisplay}{outletCity}
                      </div>
                      {outletAddr && (
                        <div className="text-[12px] text-muted-foreground mt-0.5">{outletAddr}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Alamat Tujuan</div>
                      <div className="text-[13px] text-foreground">
                        {delivery.customerAddress?.address || "-"}
                        {delivery.customerAddress?.city ? ` • ${delivery.customerAddress.city}` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Navigation className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Jarak & Biaya Delivery</div>
                      <div className="text-[13px] text-foreground">
                        {delivery.distance} km • {rupiah(delivery.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Dibuat</div>
                      <div className="text-[13px] text-foreground">{formatDate(delivery.createdAt)}</div>
                    </div>
                  </div>

                  {delivery.scheduledAt && (
                    <div className="flex items-start gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-[12px] text-muted-foreground">Dijadwalkan</div>
                        <div className="text-[13px] text-foreground">{formatDate(delivery.scheduledAt)}</div>
                      </div>
                    </div>
                  )}

                  {delivery.deliveredAt && (
                    <div className="flex items-start gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-[12px] text-muted-foreground">Diterima Customer</div>
                        <div className="text-[13px] text-foreground">{formatDate(delivery.deliveredAt)}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {delivery.driver && (
                <Card className="rounded-2xl border border-border bg-card">
                  <CardContent className="p-4 space-y-2">
                    <div className="text-[12px] text-muted-foreground">Driver</div>
                    <div className="text-[13px] font-medium text-foreground">{delivery.driver.name}</div>
                    {delivery.driver.phoneNumber && (
                      <div className="flex items-center gap-2 text-[13px]">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Link
                          href={`tel:${delivery.driver.phoneNumber}`}
                          className="underline underline-offset-2 text-primary"
                        >
                          {delivery.driver.phoneNumber}
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="rounded-2xl border border-border bg-card">
                <CardContent className="p-4 space-y-2">
                  <div className="text-[12px] text-muted-foreground">Order Terkait</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <div className="text-[13px] text-foreground">
                        {delivery.orderHeader.invoiceNo ?? delivery.orderHeader.id}
                      </div>
                    </div>
                    <Button asChild variant="outline" className="h-8 rounded-xl text-[12px]">
                      <Link href={`/customer/order/${delivery.orderHeader.id}`}>Lihat Order</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {canConfirm && (
  <div className="pt-2">
    <Button
      type="button"
      className="w-full h-11 rounded-xl"
      disabled={confirmationOrderMutation.isPending}
      onClick={() =>
        confirmationOrderMutation.mutate({
          orderHeaderId: delivery.orderHeader.id,
          deliveryId: delivery.id,          
          redirectTo: "/customer/order",   
        })
      }
    >
      {confirmationOrderMutation.isPending ? "Mengonfirmasi..." : "Konfirmasi diterima"}
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
