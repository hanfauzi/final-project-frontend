"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, LoaderCircle } from "lucide-react";
import useGetCustomerAddresses, { CustomerAddress } from "./_hooks/useGetAddresses";
import useSetPrimaryCustomerAddress from "./_hooks/useSetPrimaryAddress";
import useDeleteCustomerAddress from "./_hooks/useDeleteAddress";
import { withAuthGuard } from "@/hoc/AuthGuard";
import { AddressCard } from "../../_components/AddressCard";
import { ActionSheet } from "../../_components/ActionSheet";

function AddressListPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetCustomerAddresses();
  const { deleteAddressMutation } = useDeleteCustomerAddress();

  const sorted: CustomerAddress[] = useMemo(() => {
    const list = data ?? [];
    return [...list].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  }, [data]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTargetId, setSheetTargetId] = useState<string | null>(null);
  const { setPrimaryMutation } = useSetPrimaryCustomerAddress(sheetTargetId ?? "");

  useEffect(() => {
    setSelectedId(sorted[0]?.id ?? null);
  }, [sorted]);

  const selected = useMemo(() => sorted.find((x) => x.id === selectedId) ?? null, [sorted, selectedId]);

  function openSheetFor(id: string) {
    setSheetTargetId(id);
    setSheetOpen(true);
  }

  async function handleMakePrimaryAndSelect() {
    if (!sheetTargetId) return;
    await setPrimaryMutation.mutateAsync();
    setSelectedId(sheetTargetId);
    setSheetOpen(false);
  }

  async function handleDelete() {
    if (!sheetTargetId) return;
    try {
      await deleteAddressMutation.mutateAsync(sheetTargetId);
    } finally {
      setSheetOpen(false);
    }
  }

  function confirmSelection() {
    if (!selectedId) return;
    console.log("Selected addressId:", selectedId);
  }

  return (
    <>
      <Head>
        <title>Detail Alamat • Laundr</title>
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
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-[15px] font-semibold text-neutral-900">Detail Alamat</div>
            </div>
            <Link href="/customer/address/create" className="inline-flex items-center gap-1.5 text-neutral-900">
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Tambah</span>
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm px-4 py-4 space-y-3">
          {isLoading && (
            <div className="py-10 grid place-items-center text-neutral-600">
              <LoaderCircle className="h-5 w-5 animate-spin mb-2" />
              Memuat alamat…
            </div>
          )}

          {isError && !isLoading && (
            <div className="py-10 text-center text-red-600">Gagal memuat alamat.</div>
          )}

          {!isLoading && !isError && sorted.map((a) => (
            <AddressCard
              key={a.id}
              data={a}
              active={a.id === selectedId}
              onSelect={() => setSelectedId(a.id)}
              onMore={() => openSheetFor(a.id)}
            />
          ))}

          {!isLoading && !isError && sorted.length === 0 && (
            <div className="py-10 text-center text-neutral-600">
              Belum ada alamat tersimpan.
              <div className="mt-3">
                <Link href="/customer/address/create" className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800">
                  <Plus className="h-4 w-4 mr-1" /> Tambah Alamat
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur">
          <div className="mx-auto w-full max-w-sm px-4 py-3">
            <Button
              onClick={confirmSelection}
              disabled={!selected}
              className="w-full h-12 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-60"
            >
              Pilih Alamat
            </Button>
          </div>
        </div>

        <div className="h-6" />
      </div>

      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onMakePrimaryAndSelect={() => sheetTargetId && handleMakePrimaryAndSelect()}
        onDelete={() => sheetTargetId && handleDelete()}
      />
    </>
  );
}

export default withAuthGuard(AddressListPage, {
  principal: "CUSTOMER",
  redirectToLoginCustomer: "/customer/login",
  superAdminCanAccessCustomer: true,
});
