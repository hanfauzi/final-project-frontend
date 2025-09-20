"use client";

import { Button } from "@/components/ui/button";
import Head from "next/head";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useMemo } from "react";

import useEditCustomerAddress, { LabelEnum } from "../../_hooks/useEditAddress";
import useGetCustomerAddressById from "../../_hooks/useGetAddressById";
import { CustomerAddress } from "../../_hooks/useGetAddresses";
import useSetPrimaryCustomerAddress from "../../_hooks/useSetPrimaryAddress";
import { EditAddressCustomerSchema } from "@/features/customer/address/schema/validationCustomerEditAddressSchema";
import EditAddressFormCard from "../../_components/EditAddressFormCard";

function EditAddressPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { editAddressMutation } = useEditCustomerAddress(id);
  const { data, isLoading, isError } = useGetCustomerAddressById(id);
  const { setPrimaryMutation } = useSetPrimaryCustomerAddress(id);

  const initial: CustomerAddress | undefined = useMemo(
    () => (data ? data : undefined),
    [data]
  );

  const formik = useFormik<{
    label: LabelEnum;
    address: string;
    notes: string | null;
    city: string;
    postalCode: string;
    phoneNumber: string;
    latitude: number;
    longitude: number;
    pinpoint: string;
    makePrimary: boolean;
  }>({
    enableReinitialize: true,
    initialValues: initial
      ? {
          label: (initial.label as LabelEnum) ?? "HOME",
          address: initial.address ?? "",
          notes: initial.notes ?? "",
          city: initial.city ?? "",
          postalCode: initial.postalCode ?? "",
          phoneNumber: initial.phoneNumber ?? "",
          latitude: initial.latitude ?? 0,
          longitude: initial.longitude ?? 0,
          pinpoint:
            initial.address ||
            [initial.city, initial.postalCode].filter(Boolean).join(", "),
          makePrimary: initial.isPrimary ?? false,
        }
      : {
          label: "HOME",
          address: "",
          notes: "",
          city: "",
          postalCode: "",
          phoneNumber: "",
          latitude: 0,
          longitude: 0,
          pinpoint: "",
          makePrimary: false,
        },
    validationSchema: EditAddressCustomerSchema,
    onSubmit: async (values) => {
      try {
        await editAddressMutation.mutateAsync({
          label: values.label,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          phoneNumber: values.phoneNumber,
          latitude: values.latitude,
          longitude: values.longitude,
          notes: values.notes,
        });

        if (values.makePrimary && !initial?.isPrimary) {
          await setPrimaryMutation.mutateAsync();
        }

        router.back();
      } catch {}
    },
  });

  const pending =
    editAddressMutation.isPending || setPrimaryMutation.isPending;

  const coordsReady =
    Number.isFinite(formik.values.latitude) &&
    Number.isFinite(formik.values.longitude) &&
    (formik.values.latitude !== 0 || formik.values.longitude !== 0);

  return (
    <>
      <Head>
        <title>Ubah Alamat • Laundr</title>
      </Head>

      <div className="relative min-h-screen bg-background">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        {/* Topbar */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
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
              Ubah Alamat
            </div>
            <div className="ml-auto text-xs text-muted-foreground">
              {initial?.isPrimary ? "Alamat utama" : ""}
            </div>
          </div>
        </div>

        {/* FORM CARD (sudah dibungkus di komponen) */}
        <div className="mx-auto w-full max-w-sm px-4 py-4 pb-24">
          <EditAddressFormCard
            formik={formik}
            coordsReady={coordsReady}
            isInitialPrimary={initial?.isPrimary}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        {/* Bottom actions */}
        <div className="sticky bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur">
          <div className="mx-auto w-full max-w-sm px-4 py-3 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl"
              onClick={() => router.back()}
              disabled={pending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              onClick={() => formik.handleSubmit()}
              className="h-12 rounded-xl disabled:opacity-60"
              disabled={!formik.isValid || !coordsReady || pending}
            >
              Simpan
            </Button>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </>
  );
}

export default EditAddressPage;
