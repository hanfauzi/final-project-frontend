"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  MapPin,
  Package,
  Store,
  Truck,
  User,
  Phone,
  Info,
} from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useGetCustomerAddressById from "../../address/_hooks/useGetAddressById";
import useGetCustomerAddresses, {
  CustomerAddress,
} from "../../address/_hooks/useGetAddresses";
import useCreatePickupOrder from "../_hooks/useCreatePickUpOrder";
import { useLaundryServices } from "../_hooks/useGetServices";
import useSuggestOutlet from "../_hooks/useSuggestOutlet";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export default function CreateOrderPage() {
  const router = useRouter();
  const { customer } = useAuthStore((s) => s);

  const { data: svcResp, isLoading: svcLoading } = useLaundryServices();
  const svcList: Array<{ id: string; name: string; desc?: string }> = useMemo(
    () => svcResp?.data ?? [],
    [svcResp]
  );

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const toggleService = (id: string, checked: boolean | string) => {
    const isOn = checked === true || checked === "true";
    setSelectedServiceIds((curr) =>
      isOn ? Array.from(new Set([...curr, id])) : curr.filter((x) => x !== id)
    );
  };

  const svcMap = useMemo(
    () => new Map(svcList.map((s) => [s.id, s])),
    [svcList]
  );
  const selectedNames = useMemo(
    () =>
      selectedServiceIds
        .map((id) => svcMap.get(id)?.name)
        .filter(Boolean) as string[],
    [selectedServiceIds, svcMap]
  );

  const { data: addresses = [], isLoading: addrListLoading } =
    useGetCustomerAddresses();
  const [addressId, setAddressId] = useState<string | undefined>(undefined);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!addressId && addresses.length > 0) {
      const primary = addresses.find((a) => a.isPrimary) ?? addresses[0];
      setAddressId(primary.id);
    }
  }, [addresses, addressId]);

  const { data: addressDetail, isLoading: addrLoading } =
    useGetCustomerAddressById(addressId);
  const {
    data: suggest,
    isFetching: suggestLoading,
    isError: suggestError,
  } = useSuggestOutlet(addressId);

  const { createPickUpOrderMutation } = useCreatePickupOrder();
  const outletNameAfterCreate = useMemo(
    () => createPickUpOrderMutation.data?.data?.outlets?.name ?? "",
    [createPickUpOrderMutation.data]
  );

  function handleChooseAddress(a: CustomerAddress) {
    setAddressId(a.id);
    setSheetOpen(false);
  }

  const [receiverMode, setReceiverMode] = useState<"SELF" | "OTHER">("SELF");
  const [receiverName, setReceiverName] = useState<string>("");
  const [receiverPhone, setReceiverPhone] = useState<string>("");

  useEffect(() => {
    if (receiverMode === "SELF") {
      setReceiverName(customer?.name ?? "Customer");
      setReceiverPhone(
        addressDetail?.phoneNumber ?? customer?.phoneNumber ?? ""
      );
    }
  }, [
    receiverMode,
    customer?.name,
    customer?.phoneNumber,
    addressDetail?.phoneNumber,
  ]);

  function handleSubmit() {
    if (!addressId) return;

    if (receiverMode === "OTHER") {
      if (!receiverName?.trim()) {
        toast.error("Nama penerima wajib diisi.");
        return;
      }
      if (!receiverPhone?.trim()) {
        toast.error("Nomor HP penerima wajib diisi.");
        return;
      }
    }

    const nameToSend =
      receiverMode === "SELF"
        ? customer?.name ?? "Customer"
        : receiverName.trim();
    const phoneToSend =
      receiverMode === "SELF"
        ? addressDetail?.phoneNumber ?? customer?.phoneNumber ?? ""
        : receiverPhone.trim();

    createPickUpOrderMutation.mutate({
      customerAddressId: addressId,
      services: selectedServiceIds,
      receiverName: nameToSend,
      receiverPhone: phoneToSend,
    });
  }

  const submitDisabled =
    !selectedServiceIds.length ||
    !addressId ||
    createPickUpOrderMutation.isPending ||
    (receiverMode === "OTHER" &&
      (!receiverName.trim() || !receiverPhone.trim()));

  return (
    <>
      <Head>
        <title>Buat Order — Laundr</title>
      </Head>

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
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-[15px] font-semibold text-foreground">
              Buat Order
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="mx-auto w-full md:max-w-5xl md:px-6 md:pt-6">
            <h1 className="text-xl font-semibold text-foreground">
              Buat Order
            </h1>
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
                      ? `${addressDetail.label ?? "Alamat"} — ${
                          addressDetail.address
                        }`
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
                    <SheetContent
                      side="bottom"
                      className="max-h-[70vh] rounded-t-2xl"
                    >
                      <SheetHeader>
                        <SheetTitle>Pilih Alamat</SheetTitle>
                      </SheetHeader>

                      <div className="mt-4 space-y-2">
                        {addresses.map((a) => {
                          const active = a.id === addressId;
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => handleChooseAddress(a)}
                              className={`w-full text-left rounded-xl border p-3 transition ${
                                active
                                  ? "border-ring bg-ring/5"
                                  : "border-border hover:bg-accent"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  className={`mt-0.5 h-4 w-4 rounded-full border ${
                                    active
                                      ? "bg-ring border-ring"
                                      : "border-muted-foreground/40"
                                  }`}
                                >
                                  {active && (
                                    <Check className="h-4 w-4 text-primary-foreground" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {a.label ?? "Alamat"}
                                    {a.isPrimary ? " · Utama" : ""}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {a.address}
                                  </p>
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
                    ? "Pilih alamat dulu untuk mencari outlet"
                    : suggestLoading
                    ? "Mencari outlet terdekat"
                    : suggestError
                    ? "Gagal menemukan outlet"
                    : suggest?.data
                    ? `${suggest.data.outletName} (± ${suggest.data.distanceOutletKm} km) `
                    : "Tidak ada outlet yang mencakup alamat ini"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  Estimasi Harga Penjemputan
                </Label>
                <div className="h-11 rounded-xl border border-border bg-card px-3 grid items-center text-[13px] text-foreground">
                  {!addressId
                    ? "Pilih alamat dulu untuk mendapatkan estimasi harga"
                    : suggestLoading
                    ? "Menghitung estimasi harga"
                    : suggestError
                    ? "Gagal menghitung estimasi harga"
                    : suggest?.data
                    ? `Rp ${suggest.data.estimatedPickupPrice.toLocaleString(
                        "id-ID"
                      )}`
                    : "Harga tidak tersedia"}
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
                  <User className="h-4 w-4 text-muted-foreground" />
                  Penerima Penjemputan
                </Label>

                <div className="flex flex-col md:flex-row gap-2">
                  <Select
                    value={receiverMode}
                    onValueChange={(v: "SELF" | "OTHER") => setReceiverMode(v)}
                  >
                    <SelectTrigger className="h-11 rounded-xl w-full md:w-44">
                      <SelectValue placeholder="Pilih penerima" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SELF">Saya sendiri</SelectItem>
                      <SelectItem value="OTHER">Orang lain</SelectItem>
                    </SelectContent>
                  </Select>

                  {receiverMode === "SELF" ? (
                    <div className="w-full md:flex-1 h-11 rounded-xl border border-border bg-muted/40 px-3 grid items-center text-[13px] text-foreground">
                      {customer?.name ?? "Customer"} —{" "}
                      {addressDetail?.phoneNumber ??
                        customer?.phoneNumber ??
                        "—"}
                    </div>
                  ) : (
                    <div className="w-full md:flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="h-11 pl-10 rounded-xl pr-9"
                          placeholder="Nama penerima"
                          value={receiverName}
                          onChange={(e) => setReceiverName(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="h-11 pl-10 rounded-xl pr-9"
                          placeholder="No. HP penerima"
                          value={receiverPhone}
                          onChange={(e) => setReceiverPhone(e.target.value)}
                          inputMode="tel"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex w-full items-center text-sm font-medium text-foreground">
                  <span className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Pilih Layanan
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-6 w-6 text-muted-foreground"
                        aria-label="Info layanan"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel>Estimasi Layanan</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-sm space-y-2">
                        <div className="flex items-start justify-between">
                          <span>Reguler (kiloan)</span>
                          <span className="text-muted-foreground">2 hari</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span>Reguler (satuan)</span>
                          <span className="text-muted-foreground">1 hari</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span>Express</span>
                          <span className="text-muted-foreground">1 hari</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span>Ekonomis (satuan)</span>
                          <span className="text-muted-foreground">2 hari</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span>Ekonomis (kiloan)</span>
                          <span className="text-muted-foreground">3 hari</span>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Label>

                <div className="grid gap-3">
                  {svcLoading && (
                    <div className="text-sm text-muted-foreground">
                      Memuat layanan…
                    </div>
                  )}
                  {!svcLoading &&
                    svcList.map((s) => {
                      const checked = selectedServiceIds.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          className={`rounded-xl border p-3 transition ${
                            checked
                              ? "border-ring bg-ring/5"
                              : "border-border hover:bg-accent"
                          }`}
                        >
                          <label
                            htmlFor={s.id}
                            className="flex items-start gap-3 cursor-pointer"
                          >
                            <Checkbox
                              id={s.id}
                              checked={checked}
                              onCheckedChange={(v) => toggleService(s.id, v)}
                              className="mt-0.5"
                            />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {s.name}
                              </p>
                              {!!s.desc && (
                                <p className="text-xs text-muted-foreground">
                                  {s.desc}
                                </p>
                              )}
                            </div>
                          </label>
                        </div>
                      );
                    })}
                </div>

                {selectedNames.length > 0 && (
                  <p className="text-xs text-primary">
                    Dipilih: {selectedNames.join(", ")}
                  </p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitDisabled}
                className="w-full h-12 rounded-xl disabled:opacity-50"
              >
                {createPickUpOrderMutation.isPending ? "Membuat" : "Buat Order"}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
