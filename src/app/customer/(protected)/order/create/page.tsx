"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, ChevronLeft, MapPin, Package, Store } from "lucide-react";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useGetCustomerAddressById from "../../address/_hooks/useGetAddressById";
import useGetCustomerAddresses, { CustomerAddress } from "../../address/_hooks/useGetAddresses";
import useCreatePickupOrder from "../_hooks/useCreatePickUpOrder";
import useSuggestOutlet from "../_hooks/useSuggestOutlet";

const services = [
  { id: "express-wash", name: "Cuci Kiloan Express", desc: "Selesai 1×24 jam" },
  { id: "reguler-wash", name: "Cuci Kiloan Reguler", desc: "Selesai 2–3 hari" },
  { id: "express-dry", name: "Cuci Kering Express", desc: "Selesai dalam 6 jam" },
];

export default function CreateOrderPage() {
  const router = useRouter();

  const { data: addresses = [], isLoading: addrListLoading } = useGetCustomerAddresses();
  const [addressId, setAddressId] = useState<string | undefined>(undefined);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!addressId && addresses.length > 0) {
      const primary = addresses.find((a) => a.isPrimary) ?? addresses[0];
      setAddressId(primary.id);
    }
  }, [addresses, addressId]);

  const { data: addressDetail, isLoading: addrLoading } = useGetCustomerAddressById(addressId);
  const { data: suggest, isFetching: suggestLoading, isError: suggestError } = useSuggestOutlet(addressId);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const toggleService = (name: string, checked: boolean | string) => {
    const isOn = checked === true || checked === "true";
    setSelectedServices((curr) => (isOn ? Array.from(new Set([...curr, name])) : curr.filter((s) => s !== name)));
  };

  const [useSatuan, setUseSatuan] = useState(false);
  const [satuanName, setSatuanName] = useState("");

  const { createPickUpOrderMutation } = useCreatePickupOrder();
  const outletNameAfterCreate = useMemo(
    () => createPickUpOrderMutation.data?.data?.outlets?.name ?? "",
    [createPickUpOrderMutation.data]
  );

  function handleChooseAddress(a: CustomerAddress) {
    setAddressId(a.id);
    setSheetOpen(false);
  }

  function handleSubmit() {
    if (!addressId) return;

    const parts: string[] = [];
    if (selectedServices.length) parts.push(selectedServices.join(", "));
    if (useSatuan && satuanName.trim()) parts.push(`Satuan: ${satuanName.trim()}`);

    const notes = parts.join(" | ");
    if (!notes) return;

    createPickUpOrderMutation.mutate({ customerAddressId: addressId, notes });
  }

  const submitDisabled =
    (!selectedServices.length && !(useSatuan && satuanName.trim())) ||
    !addressId || createPickUpOrderMutation.isPending;

  return (
    <>
      <Head><title>Buat Order — Laundr</title></Head>

      <div className="relative min-h-screen bg-transparent"> 
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur md:hidden"> 
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-[15px] font-semibold text-foreground">Buat Order</div>
          </div>
        </div>

        <div className="hidden md:block"> 
          <div className="mx-auto w-full md:max-w-5xl md:px-6 md:pt-6">
            <h1 className="text-xl font-semibold text-foreground">Buat Order</h1>
          </div>
        </div>

        <main className="mx-auto w-full max-w-sm px-4 py-6 md:max-w-5xl md:px-6 md:py-8"> 
          <Card className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Alamat Penjemputan
                </Label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="h-11 flex-1 rounded-xl border border-border bg-card px-3 text-left text-[13px] text-foreground hover:bg-accent"
                  >
                    {addrListLoading || addrLoading
                      ? "Memuat alamat…"
                      : addressDetail
                      ? `${addressDetail.label ?? "Alamat"} — ${addressDetail.address}`
                      : addresses.length === 0
                      ? "Belum ada alamat. Tambah dulu."
                      : "Pilih alamat"}
                  </button>

                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="h-11 rounded-xl">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="max-h-[70vh] rounded-t-2xl">
                      <SheetHeader><SheetTitle>Pilih Alamat</SheetTitle></SheetHeader>

                      <div className="mt-4 space-y-2">
                        {addresses.map((a) => {
                          const active = a.id === addressId;
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => handleChooseAddress(a)}
                              className={`w-full text-left rounded-xl border p-3 transition ${
                                active ? "border-ring bg-ring/5" : "border-border hover:bg-accent"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  className={`mt-0.5 h-4 w-4 rounded-full border ${
                                    active ? "bg-ring border-ring" : "border-muted-foreground/40"
                                  }`}
                                >
                                  {active && <Check className="h-4 w-4 text-primary-foreground" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {a.label ?? "Alamat"}{a.isPrimary ? " · Utama" : ""}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{a.address}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}

                        {addresses.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            Belum ada alamat. Silakan tambahkan terlebih dulu.
                          </p>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  Outlet Terdekat
                </Label>
                <div className="h-11 rounded-xl border border-border bg-card px-3 grid items-center text-[13px] text-foreground">
                  {!addressId
                    ? "Pilih alamat dulu untuk menghitung outlet"
                    : suggestLoading
                    ? "Menghitung outlet…"
                    : suggestError
                    ? "Gagal menghitung outlet"
                    : suggest?.data
                    ? `${suggest.data.outletName} (± ${suggest.data.distanceOutletKm} km)`
                    : "Tidak ada outlet yang mencakup alamat ini"}
                </div>
              </div>

              {!!outletNameAfterCreate && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    Outlet Terpilih
                  </Label>
                  <div className="h-11 rounded-xl border border-border bg-card px-3 grid items-center text-[13px] text-foreground">
                    {outletNameAfterCreate}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Pilih Layanan
                </Label>

                <div className="grid gap-3">
                  {services.map((s) => {
                    const checked = selectedServices.includes(s.name);
                    return (
                      <div
                        key={s.id}
                        className={`rounded-xl border p-3 transition ${
                          checked ? "border-ring bg-ring/5" : "border-border hover:bg-accent"
                        }`}
                      >
                        <label htmlFor={s.id} className="flex items-start gap-3 cursor-pointer">
                          <Checkbox
                            id={s.id}
                            checked={checked}
                            onCheckedChange={(v) => toggleService(s.name, v)}
                            className="mt-0.5"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.desc}</p>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>

                {selectedServices.length > 0 && (
                  <p className="text-xs text-primary">
                    Dipilih: {selectedServices.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Layanan Satuan (opsional)</Label>
                <div className={`rounded-2xl border p-3 ${useSatuan ? "border-ring bg-ring/5" : "border-border"}`}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={useSatuan} onCheckedChange={(v) => setUseSatuan(v === true)} />
                    <span className="text-[13px] text-foreground font-medium">Tambahkan item satuan</span>
                  </label>

                  {useSatuan && (
                    <div className="mt-3 grid gap-2">
                      <Input
                        value={satuanName}
                        onChange={(e) => setSatuanName(e.target.value)}
                        placeholder="Contoh: Kemeja, Jas, Selimut"
                        className="h-11 rounded-xl focus-visible:ring-ring"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Tulis satu item (bebas). Jika lebih dari satu jenis, pisahkan dengan koma.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitDisabled}
                className="w-full h-12 rounded-xl disabled:opacity-50"
              >
                {createPickUpOrderMutation.isPending ? "Membuat..." : "Buat Order"}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
