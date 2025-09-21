// app/customer/pickup/[id]/page.tsx
"use client";

import Head from "next/head";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CalendarClock,
  ChevronLeft,
  Hash,
  Navigation,
  Phone,
  Store,
  Truck,
} from "lucide-react";
import useGetCustomerPickUpOrderById from "../../_hooks/useGetCustomerPickUpOrderById";
import useCancelPickUpOrder from "../../_hooks/useCancelPickUpOrder";
import { StatusBadge } from "../../_components/StatusBadge";
import { formatDate } from "../../_components/FormatDate";

// Sesuaikan path kedua import ini dengan letak komponenmu

// Hook data + cancel (sesuaikan path-nya kalau berbeda)

export default function PickupOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: pickup, isLoading, isError } = useGetCustomerPickUpOrderById(id);
  const { cancelOrderMutation } = useCancelPickUpOrder();

  const canCancel = !!pickup && pickup.status === "WAITING_FOR_DRIVER";
  const outletDisplay = pickup?.outlet?.name ?? "-";
  const outletCity = pickup?.outlet?.cityName ? ` • ${pickup.outlet.cityName}` : "";
  const outletAddr = pickup?.outlet?.address ?? "";

  const shortId = pickup?.id ? `#${pickup.id.slice(0, 6).toUpperCase()}` : "-";
  const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <>
      <Head><title>Detail Pickup — Laundr</title></Head>

      <div className="relative min-h-screen bg-background">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-[15px] font-semibold text-foreground">Detail Pickup</div>
            </div>
          </div>
        </div>

        <main className="mx-auto w-full max-w-sm px-4 py-4 space-y-3">
          {isLoading && (
            <Card className="rounded-2xl border border-border bg-card">
              <CardContent className="p-5 text-muted-foreground">Memuat detail pickup…</CardContent>
            </Card>
          )}

          {isError && !isLoading && (
            <Card className="rounded-2xl border border-border bg-card">
              <CardContent className="p-5 text-destructive">Gagal memuat detail pickup.</CardContent>
            </Card>
          )}

          {!isLoading && !isError && !pickup && (
            <Card className="rounded-2xl border border-border bg-card">
              <CardContent className="p-5 text-muted-foreground">Pickup tidak ditemukan.</CardContent>
            </Card>
          )}

          {!isLoading && !isError && pickup && (
            <>
              <Card className="rounded-2xl border border-border bg-card text-card-foreground">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Pickup ID</div>
                      <div className="text-[13px] font-medium text-foreground">{shortId}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[12px] text-muted-foreground">Status</div>
                    <StatusBadge status={pickup.status} />
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
                    <Navigation className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Jarak & Biaya Pickup</div>
                      <div className="text-[13px] text-foreground">
                        {pickup.distance} km • {rupiah(pickup.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-[12px] text-muted-foreground">Dibuat</div>
                      <div className="text-[13px] text-foreground">{formatDate(pickup.createdAt)}</div>
                    </div>
                  </div>

                  {pickup.scheduledAt && (
                    <div className="flex items-start gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-[12px] text-muted-foreground">Dijadwalkan</div>
                        <div className="text-[13px] text-foreground">{formatDate(pickup.scheduledAt)}</div>
                      </div>
                    </div>
                  )}

                  {pickup.pickedUpAt && (
                    <div className="flex items-start gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-[12px] text-muted-foreground">Diambil Kurir</div>
                        <div className="text-[13px] text-foreground">{formatDate(pickup.pickedUpAt)}</div>
                      </div>
                    </div>
                  )}

                  {pickup.arrivedAtOutlet && (
                    <div className="flex items-start gap-2">
                      <Store className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-[12px] text-muted-foreground">Tiba di Outlet</div>
                        <div className="text-[13px] text-foreground">{formatDate(pickup.arrivedAtOutlet)}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {pickup.driver && (
                <Card className="rounded-2xl border border-border bg-card">
                  <CardContent className="p-4 space-y-2">
                    <div className="text-[12px] text-muted-foreground">Driver</div>
                    <div className="text-[13px] font-medium text-foreground">{pickup.driver.name}</div>
                    {pickup.driver.phoneNumber && (
                      <div className="flex items-center gap-2 text-[13px]">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Link
                          href={`tel:${pickup.driver.phoneNumber}`}
                          className="underline underline-offset-2 text-primary"
                        >
                          {pickup.driver.phoneNumber}
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {pickup.notes && (
                <Card className="rounded-2xl border border-border bg-card">
                  <CardContent className="p-4">
                    <div className="text-[12px] text-muted-foreground mb-1">Catatan</div>
                    <div className="text-[13px] text-foreground">{pickup.notes}</div>
                  </CardContent>
                </Card>
              )}

              {canCancel && (
                <div className="pt-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" className="w-full h-11 rounded-xl">
                        Batalkan Pickup
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Batalkan Pickup?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Pickup akan dibatalkan. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={cancelOrderMutation.isPending}
                          onClick={() => pickup?.id && cancelOrderMutation.mutate(pickup.id)}
                        >
                          {cancelOrderMutation.isPending ? "Membatalkan" : "Batalkan Pickup"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
