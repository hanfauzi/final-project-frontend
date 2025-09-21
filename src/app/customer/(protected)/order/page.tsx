"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Hash,
  Navigation,
  Package,
  Plus,
  RefreshCw,
  Truck,
  X,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateSheet } from "./_components/DateSheet";
import { formatDate } from "./_components/FormatDate";
import { OrderStatusSheet } from "./_components/OrderStatusSheet";
import { PickUpStatusSheet } from "./_components/PickUpOrderStatusSheet";
import { StatusBadge } from "./_components/StatusBadge";
import { useDebounce } from "./_hooks/useDebounce";
import useGetCustomerPickUpOrders from "./_hooks/useGetCustomerPickUpOrders";
import useGetCustomerOrders from "./_hooks/useGetOrders";
import { PickUpStatusBadge } from "./_components/PickUpStatusBadge";

export default function CustomerOrdersPage() {
  const router = useRouter();

  const [pageO, setPageO] = useState(1);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [statusO, setStatusO] = useState<string | undefined>();
  const [dateFromO, setDateFromO] = useState<string | undefined>();
  const [dateToO, setDateToO] = useState<string | undefined>();
  const debouncedInvoice = useDebounce(invoiceNo, 500);

  const ordersQ = useGetCustomerOrders({
    page: pageO,
    take: 5,
    status: statusO,
    invoiceNo: debouncedInvoice || undefined,
    dateFrom: dateFromO,
    dateTo: dateToO,
  });

  const [pageP, setPageP] = useState(1);
  const [statusP, setStatusP] = useState<string | undefined>();
  const [dateFromP, setDateFromP] = useState<string | undefined>();
  const [dateToP, setDateToP] = useState<string | undefined>();

  const pickupsQ = useGetCustomerPickUpOrders({
    page: pageP,
    take: 5,
    status: statusP,
    dateFrom: dateFromP,
    dateTo: dateToP,
  });

  // ===== Deliveries
  // const [pageD, setPageD] = useState(1);
  // const [statusD, setStatusD] = useState<string | undefined>();
  // const [dateFromD, setDateFromD] = useState<string | undefined>();
  // const [dateToD, setDateToD] = useState<string | undefined>();

  // const deliveriesQ = useGetCustomerDeliveryOrders({
  //   page: pageD,
  //   take: 5,
  //   status: statusD,
  //   dateFrom: dateFromD,
  //   dateTo: dateToD,
  // });

  const orders = ordersQ.data?.data ?? [];
  const metaO = ordersQ.data?.meta;

  const pickups = pickupsQ.data?.data ?? [];
  const metaP = pickupsQ.data?.meta;

  // const deliveries = deliveriesQ.data?.data ?? [];
  // const metaD = deliveriesQ.data?.meta;

  return (
    <>
      <Head>
        <title>Transaksi Saya — Laundr</title>
      </Head>

      <div className="relative min-h-screen bg-background">
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
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
              <div className="text-[15px] font-semibold text-foreground">
                Transaksi Saya
              </div>
            </div>
            <Link
              href="/customer/order/create"
              className="inline-flex items-center gap-1.5 text-primary"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Create Order</span>
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm px-4 py-3">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl">
              <TabsTrigger value="pickups">Pickup</TabsTrigger>
              <TabsTrigger value="deliveries">Delivery</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="pickups" className="mt-4 space-y-3">
              <div className="flex gap-2">
                <PickUpStatusSheet  value={statusP}
                  onChange={(v) => { setStatusP(v); setPageP(1); }}/>
 

                <DateSheet separateFields
                  from={dateFromP}
                  to={dateToP}
                  onApply={(f, t) => {
                    setDateFromP(f);
                    setDateToP(t);
                    setPageP(1);
                  }}
                  onClear={() => {
                    setDateFromP(undefined);
                    setDateToP(undefined);
                    setPageP(1);
                  }}
                />
              </div>

              <main className="space-y-3 pb-6">
                {pickupsQ.isLoading && (
                  <div className="py-10 grid place-items-center text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mb-2" />
                    Memuat pickup…
                  </div>
                )}

                {pickupsQ.isError && !pickupsQ.isLoading && (
                  <div className="py-10 text-center text-destructive">
                    Gagal memuat pickup.
                  </div>
                )}

                {!pickupsQ.isLoading &&
                  !pickupsQ.isError &&
                  pickups.length === 0 && (
                    <div className="py-10 text-center text-muted-foreground">
                      Belum ada pickup order.
                    </div>
                  )}

                {pickups.map((p) => {
                  const href = `/customer/order/pickup/${p.id}`;
                  return (
                    <Link key={p.id} href={href} className="block">
                      <Card className="rounded-xl border border-border bg-card text-card-foreground hover:bg-accent">
                        <CardContent className="p-3.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                                <Hash className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                  #{p.id.slice(0, 6).toUpperCase()}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <div className="text-[13px] font-medium text-foreground">
                                  {p.outlet.name} • {p.outlet.cityName}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Navigation className="h-4 w-4 text-muted-foreground" />
                                <div className="text-[12px] text-muted-foreground">
                                  {p.distance} km • Rp{" "}
                                  {p.price.toLocaleString("id-ID")}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                <div className="text-[12px] text-muted-foreground">
                                  {formatDate(p.createdAt)}
                                </div>
                              </div>

                              <PickUpStatusBadge status={p.status} />
                            </div>

                            {p._count.orderHeaders > 0 && (
                              <span className="text-sm text-primary underline underline-offset-2">
                                {p._count.orderHeaders} order
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
                {metaP && metaP.totalPages > 1 && (
                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={pageP <= 1}
                      onClick={() => setPageP((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {metaP.page} / {metaP.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={pageP >= metaP.totalPages}
                      onClick={() =>
                        setPageP((p) => Math.min(metaP.totalPages, p + 1))
                      }
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </main>
            </TabsContent>

            {/* ===================== DELIVERIES ===================== */}
            {/* <TabsContent value="deliveries" className="mt-4 space-y-3">
              <div className="flex gap-2">
                <Select
                  value={statusD}
                  onValueChange={(v) => { setStatusD(v === "ALL" ? undefined : v); setPageD(1); }}
                >
                  <SelectTrigger className="h-10 rounded-xl text-[13px]">
                    <SelectValue placeholder="Status Delivery" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua status</SelectItem>
                    <SelectItem value="NOT_READY_TO_DELIVER">Not Ready</SelectItem>
                    <SelectItem value="WAITING_FOR_DRIVER">Waiting for Driver</SelectItem>
                    <SelectItem value="ON_THE_WAY_TO_OUTLET">On the way to Outlet</SelectItem>
                    <SelectItem value="ON_THE_WAY_TO_CUSTOMER">On the way to Customer</SelectItem>
                    <SelectItem value="RECEIVED_BY_CUSTOMER">Received by Customer</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <DateSheet
                  from={dateFromD}
                  to={dateToD}
                  onApply={(f, t) => { setDateFromD(f); setDateToD(t); setPageD(1); }}
                  onClear={() => { setDateFromD(undefined); setDateToD(undefined); setPageD(1); }}
                />
              </div>

              <main className="space-y-3 pb-6">
                {deliveriesQ.isLoading && (
                  <div className="py-10 grid place-items-center text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mb-2" />
                    Memuat delivery…
                  </div>
                )}

                {deliveriesQ.isError && !deliveriesQ.isLoading && (
                  <div className="py-10 text-center text-destructive">Gagal memuat delivery.</div>
                )}

                {!deliveriesQ.isLoading && !deliveriesQ.isError && deliveries.length === 0 && (
                  <div className="py-10 text-center text-muted-foreground">Belum ada delivery order.</div>
                )}

                {deliveries.map((d) => (
                  <Link key={d.id} href={`/customer/order/${d.orderHeaderId}`} className="block">
                    <Card className="rounded-xl border border-border bg-card text-card-foreground hover:bg-accent">
                      <CardContent className="p-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                              <Hash className="h-3.5 w-3.5" />
                              <span className="font-medium text-foreground">
                                {d.orderHeader.invoiceNo ?? `#${d.orderHeaderId.slice(0, 6).toUpperCase()}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <div className="text-[13px] font-medium text-foreground">
                                {d.outlet.name}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <div className="text-[12px] text-muted-foreground">
                                Ongkir Rp {d.price.toLocaleString("id-ID")}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <CalendarClock className="h-4 w-4 text-muted-foreground" />
                              <div className="text-[12px] text-muted-foreground">{formatDate(d.createdAt)}</div>
                            </div>

                            <StatusBadge status={d.status} />
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                {metaD && metaD.totalPages > 1 && (
                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="outline" size="sm" className="rounded-full"
                      disabled={pageD <= 1} onClick={() => setPageD(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {metaD.page} / {metaD.totalPages}
                    </span>
                    <Button
                      variant="outline" size="sm" className="rounded-full"
                      disabled={pageD >= metaD.totalPages} onClick={() => setPageD(p => Math.min(metaD.totalPages, p + 1))}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </main>
            </TabsContent> */}

            <TabsContent value="orders" className="mt-4 space-y-3">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Cari Invoice / Order ID…"
                    value={invoiceNo}
                    onChange={(e) => {
                      setInvoiceNo(e.target.value);
                      setPageO(1);
                    }}
                    className="h-10 rounded-xl text-[13px] pr-20 focus-visible:ring-ring"
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                    {ordersQ.isFetching && !ordersQ.isLoading && (
                      <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {invoiceNo && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          setInvoiceNo("");
                          setPageO(1);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <OrderStatusSheet value={statusO} onChange={(v) => { setStatusO(v); setPageO(1); }} />
 

                  <DateSheet
                    from={dateFromO}
                    to={dateToO}
                    onApply={(f, t) => {
                      setDateFromO(f);
                      setDateToO(t);
                      setPageO(1);
                    }}
                    onClear={() => {
                      setDateFromO(undefined);
                      setDateToO(undefined);
                      setPageO(1);
                    }}
                  />
                </div>
              </div>

              <main className="space-y-3 pb-6">
                {ordersQ.isLoading && (
                  <div className="py-10 grid place-items-center text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mb-2" />
                    Memuat order…
                  </div>
                )}

                {ordersQ.isError && !ordersQ.isLoading && (
                  <div className="py-10 text-center text-destructive">
                    Gagal memuat order.
                  </div>
                )}

                {!ordersQ.isLoading &&
                  !ordersQ.isError &&
                  orders.length === 0 && (
                    <div className="py-10 text-center text-muted-foreground">
                      Belum ada order.
                    </div>
                  )}

                {orders.map((o) => {
                  const inv =
                    o.invoiceNo ?? `#${o.id.slice(0, 6).toUpperCase()}`;
                  return (
                    <Link
                      key={o.id}
                      href={`/customer/order/${o.id}`}
                      className="block"
                    >
                      <Card className="rounded-xl border border-border bg-card text-card-foreground hover:bg-accent">
                        <CardContent className="p-3.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                                <Hash className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                  {inv}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <div className="text-[13px] font-medium text-foreground">
                                  {o.notes || "Tanpa catatan"}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                <div className="text-[12px] text-muted-foreground">
                                  {formatDate(o.createdAt)}
                                </div>
                              </div>
                              <StatusBadge status={o.status} />
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}

                {metaO && metaO.totalPages > 1 && (
                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={pageO <= 1}
                      onClick={() => setPageO((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {metaO.page} / {metaO.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={pageO >= metaO.totalPages}
                      onClick={() =>
                        setPageO((p) => Math.min(metaO.totalPages, p + 1))
                      }
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </main>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
