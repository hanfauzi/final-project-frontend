"use client";

import Head from "next/head";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Store, ChevronDown, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import useGetCustomerAddresses, { CustomerAddress } from "../address/_hooks/useGetAddresses";
import useGetCustomerAddressById from "../address/_hooks/useGetAddressById";
import useCreatePickupOrder from "./_hooks/useCreateOrder";
import useSuggestOutlet from "./_hooks/useSuggestOutlet"; // ⬅️ tambah ini

const services = [
  { id: "express-wash", name: "Cuci Kiloan Express", desc: "Selesai 1×24 jam" },
  { id: "reguler-wash", name: "Cuci Kiloan Reguler", desc: "Selesai 2–3 hari" },
  { id: "express-dry",  name: "Cuci Kering Express", desc: "Selesai dalam 6 jam" },
];

export default function CreateOrderPage() {
  // service selection
  const [service, setService] = useState<string>("");

  // address selection
  const { data: addresses = [], isLoading: addrListLoading } = useGetCustomerAddresses();
  const [addressId, setAddressId] = useState<string | undefined>(undefined);
  const [sheetOpen, setSheetOpen] = useState(false);

  // auto-pick primary (atau first) saat daftar alamat sudah ada
  useEffect(() => {
    if (!addressId && addresses.length > 0) {
      const primary = addresses.find(a => a.isPrimary) ?? addresses[0];
      setAddressId(primary.id);
    }
  }, [addresses, addressId]);

  // detail address terpilih (untuk ditampilkan di field)
  const { data: addressDetail, isLoading: addrLoading } = useGetCustomerAddressById(addressId);

  // suggest outlet berdasar address terpilih (sebelum submit)
  const {
    data: suggest,
    isFetching: suggestLoading,
    isError: suggestError,
  } = useSuggestOutlet(addressId);

  // create order
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
    if (!service || !addressId) return;
    createPickUpOrderMutation.mutate({
      customerAddressId: addressId,
      notes: service, // layanan dimasukkan sebagai notes
    });
  }

  const submitDisabled =
    !service || !addressId || createPickUpOrderMutation.isPending;

  return (
    <>
      <Head><title>Buat Order — Laundr</title></Head>

      <div className="relative min-h-screen bg-neutral-50 flex flex-col">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        <main className="flex-1 mx-auto w-full max-w-sm px-4 py-6">
          <Card className="rounded-2xl shadow-sm border-neutral-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-900">
                Buat Order Penjemputan
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Alamat Penjemputan (klik untuk pilih) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                  <MapPin className="h-4 w-4 text-neutral-500" />
                  Alamat Penjemputan
                </Label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="h-11 flex-1 rounded-xl border border-neutral-300 bg-white px-3 text-left text-[13px] text-neutral-800 hover:bg-neutral-100"
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
                    <SheetContent side="bottom" className="max-h-[70vh]">
                      <SheetHeader>
                        <SheetTitle>Pilih Alamat</SheetTitle>
                      </SheetHeader>

                      <div className="mt-4 space-y-2">
                        {addresses.map(a => {
                          const active = a.id === addressId;
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => handleChooseAddress(a)}
                              className={`w-full text-left rounded-xl border p-3 hover:bg-neutral-100 transition ${
                                active ? "border-neutral-900 bg-neutral-900/5" : "border-neutral-200"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`mt-0.5 h-4 w-4 rounded-full border ${active ? "bg-neutral-900 border-neutral-900" : "border-neutral-400"}`}>
                                  {active && <Check className="h-4 w-4 text-white" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-neutral-900">
                                    {a.label ?? "Alamat"}{a.isPrimary ? " · Utama" : ""}
                                  </p>
                                  <p className="text-xs text-neutral-600">{a.address}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}

                        {addresses.length === 0 && (
                          <p className="text-sm text-neutral-500">Belum ada alamat. Silakan tambahkan terlebih dulu.</p>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Outlet Terdekat (suggest sebelum submit) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                  <Store className="h-4 w-4 text-neutral-500" />
                  Outlet Terdekat
                </Label>
                <div className="h-11 rounded-xl border border-neutral-300 bg-white px-3 grid items-center text-[13px] text-neutral-800">
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

              {/* Outlet (muncul setelah create sukses) */}
              {!!outletNameAfterCreate && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                    <Store className="h-4 w-4 text-neutral-500" />
                    Outlet Terpilih
                  </Label>
                  <div className="h-11 rounded-xl border border-neutral-300 bg-white px-3 grid items-center text-[13px] text-neutral-800">
                    {outletNameAfterCreate}
                  </div>
                </div>
              )}

              {/* Pilih Layanan */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                  <Package className="h-4 w-4 text-neutral-500" />
                  Pilih Layanan
                </Label>

                <RadioGroup value={service} onValueChange={setService} className="grid gap-3">
                  {services.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-xl border border-neutral-200 hover:bg-neutral-100 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-900/5 transition"
                    >
                      <label htmlFor={s.id} className="flex items-start gap-3 p-3 cursor-pointer w-full">
                        <RadioGroupItem id={s.id} value={s.name} className="mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{s.name}</p>
                          <p className="text-xs text-neutral-600">{s.desc}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>

                {!!service && <p className="text-xs text-emerald-600">Dipilih: {service}</p>}
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitDisabled}
                className="w-full h-12 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[.99] disabled:opacity-50"
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
