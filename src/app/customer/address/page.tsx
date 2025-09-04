"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { ActionSheet } from "../_components/ActionSheet";
import { AddressCard } from "../_components/AddressCard";
import useGetCustomerAddresses, {
  CustomerAddress,
} from "../_hooks/useGetAddresses";
import Link from "next/link";
import useSetPrimaryCustomerAddress from "../_hooks/useSetPrimaryAddress";
import useDeleteCustomerAddress from "../_hooks/useDeleteAddress";

export default function AddressListPage() {
  const { data, isLoading, isError } = useGetCustomerAddresses();
  const { deleteAddressMutation } = useDeleteCustomerAddress();
  const sorted: CustomerAddress[] = useMemo(() => {
    const list = data ?? [];
    return [...list].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  }, [data]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTargetId, setSheetTargetId] = useState<string | null>(null);
  const { setPrimaryMutation } = useSetPrimaryCustomerAddress(
    sheetTargetId ?? ""
  );

  useEffect(() => {
    setSelectedId(sorted[0]?.id ?? null);
  }, [sorted]);

  const selected = useMemo(
    () => sorted.find((x) => x.id === selectedId) ?? null,
    [sorted, selectedId]
  );

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
    // TODO: POST /api/orders { addressId: selectedId }
    console.log("Selected addressId:", selectedId);
  }

  return (
    <>
      <Head>
        <title>Detail Alamat • Laundr</title>
      </Head>

      <div className="min-h-screen bg-neutral-50">
        <div className="sticky top-0 z-40 bg-neutral-50/80 backdrop-blur border-b border-neutral-200">
          <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => history.back()}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="font-semibold text-neutral-900">
                Detail Alamat
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-neutral-900"
              onClick={() => console.log("Tambah Alamat")}
            >
              <Link
                href={`/customer/address/create`}
                className="inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4 mr-1" /> Tambah Alamat
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-4 space-y-3">
          {isLoading && (
            <div className="text-sm text-neutral-600">Memuat alamat…</div>
          )}
          {isError && !isLoading && (
            <div className="text-sm text-red-600">Gagal memuat alamat.</div>
          )}
          {!isLoading &&
            !isError &&
            sorted.map((a) => (
              <AddressCard
                key={a.id}
                data={a}
                active={a.id === selectedId}
                onSelect={() => setSelectedId(a.id)}
                onMore={() => openSheetFor(a.id)}
              />
            ))}
          {!isLoading && !isError && sorted.length === 0 && (
            <div className="text-sm text-neutral-600">
              Belum ada alamat tersimpan.
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-2xl px-4 py-3">
            <Button
              onClick={confirmSelection}
              disabled={!selected}
              className="w-full h-11 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Pilih Alamat
            </Button>
          </div>
        </div>
      </div>

      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onMakePrimaryAndSelect={() =>
          sheetTargetId && handleMakePrimaryAndSelect()
        }
        onDelete={() => sheetTargetId && handleDelete()}
      />
    </>
  );
}
