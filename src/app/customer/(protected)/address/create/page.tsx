"use client";

import { Button } from "@/components/ui/button";
import { EditAddressCustomerSchema } from "@/features/customer/address/schema/validationCustomerEditAddressSchema";
import { useFormik } from "formik";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import useCreateCustomerAddress from "../_hooks/useCreateAddress";
import type { LabelEnum } from "../_hooks/useEditAddress";
import CreateAddressFormCard from "../_components/CreateAddressFormCard";

function CreateAddressPage() {
  const router = useRouter();
  const { createAddressMutation } = useCreateCustomerAddress();

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
    initialValues: {
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
        await createAddressMutation.mutateAsync({
          label: values.label,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          phoneNumber: values.phoneNumber,
          latitude: values.latitude,
          longitude: values.longitude,
          notes: values.notes,
          isPrimary: values.makePrimary,
        });
        router.back();
      } catch {}
    },
  });

  const pending = createAddressMutation.isPending;
  const coordsReady =
    Number.isFinite(formik.values.latitude) &&
    Number.isFinite(formik.values.longitude) &&
    (formik.values.latitude !== 0 || formik.values.longitude !== 0);

  return (
    <>
      <Head><title>Tambah Alamat • Laundr</title></Head>

      <div className="relative min-h-screen bg-background">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -50%, rgba(0,0,0,0.08), transparent 60%), radial-gradient(600px 260px at 100% 10%, rgba(0,0,0,0.04), transparent 70%)",
          }}
        />

        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <div className="mx-auto w-full max-w-sm px-4 h-12 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-[15px] font-semibold text-foreground">Tambah Alamat</div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm px-4 py-4 pb-24">
          <CreateAddressFormCard formik={formik} coordsReady={coordsReady} />
        </div>

        <div className="sticky bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur">
          <div className="mx-auto w-full max-w-sm px-4 py-3 grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={() => router.back()} disabled={pending}>
              Batal
            </Button>
            <Button
              type="submit"
              onClick={() => formik.handleSubmit()}
              className="h-12 rounded-xl disabled:opacity-60"
              disabled={!formik.isValid || !coordsReady || pending}
            >
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Menyimpan…
                </span>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAddressPage;
