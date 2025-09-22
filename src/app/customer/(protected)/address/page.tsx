"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle, Plus } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ActionSheet } from "./_components/ActionSheet";
import { AddressCard } from "./_components/AddressCard";
import useDeleteCustomerAddress from "./_hooks/useDeleteAddress";
import useGetCustomerAddresses, { CustomerAddress } from "./_hooks/useGetAddresses";
import useSetPrimaryCustomerAddress from "./_hooks/useSetPrimaryAddress";

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

  return (
    <>
      <Head><title>Detail Alamat • Laundr</title></Head>

      <div className="relative min-h-screen bg-transparent">
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur md:hidden">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-[15px] font-semibold text-foreground">Detail Alamat</div>
            </div>
            <Link href="/customer/address/create" className="inline-flex items-center gap-1.5 text-primary">
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Tambah</span>
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="mx-auto w-full md:max-w-5xl md:px-6 md:pt-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-foreground">Detail Alamat</h1>
              <Button asChild className="h-10 rounded-xl">
                <Link href="/customer/address/create"><Plus className="h-4 w-4 mr-2" />Tambah</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm px-4 py-4 space-y-3 md:max-w-5xl md:px-6 md:py-6">
          {isLoading && (
            <div className="py-10 grid place-items-center text-muted-foreground">
              <LoaderCircle className="h-5 w-5 animate-spin mb-2" />
              Memuat alamat…
            </div>
          )}

          {isError && !isLoading && (
            <div className="py-10 text-center text-destructive">Gagal memuat alamat.</div>
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
            <div className="py-10 text-center text-muted-foreground">
              Belum ada alamat tersimpan.
              <div className="mt-3">
                <Button asChild className="h-10 rounded-xl">
                  <Link href="/customer/address/create">
                    <Plus className="h-4 w-4 mr-1" /> Tambah Alamat
                  </Link>
                </Button>
              </div>
            </div>
          )}
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

export default AddressListPage;
